/* Uji end-to-end API: pasang → hapus tunggal → pulihkan → hapus massal,
   semua sambil memantau /api/progres/:id.

   Server dijalankan sendiri bila belum ada di port uji, sehingga `npm test`
   bisa dijalankan langsung tanpa langkah awal. */
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

const root = path.join(__dirname, '..');
const DEFAULT_PORT = 59331;
const headers = { 'x-fm-request': '1' };

let base = '';
let ownedServer = null;

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function ping(url) {
  try {
    const response = await fetch(url + '/api/status', { signal: AbortSignal.timeout(800) });
    return response.ok ? url : null;
  } catch {
    return null;
  }
}

async function ensureServer() {
  const candidates = [];
  const envPort = Number(process.env.FM_TEST_PORT || 0);
  if (envPort > 0) candidates.push(envPort);
  candidates.push(DEFAULT_PORT, await freePort());

  for (const port of candidates) {
    const url = await ping(`http://127.0.0.1:${port}`);
    if (url) return url;
  }

  const port = await freePort();
  const proc = spawn(process.execPath, [path.join(root, 'server.js')], {
    cwd: root,
    env: { ...process.env, FM_NO_OPEN: '1', PORT: String(port) },
    stdio: 'ignore',
    windowsHide: true
  });
  proc.on('error', (error) => console.error('  server gagal dimulai:', error.message));
  ownedServer = proc;

  const url = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 160; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (proc.exitCode !== null) throw new Error('Server berhenti saat mulai.');
    if (await ping(url)) {
      // Panaskan cache pindai agar langkah hapus tidak menunggu pindaian penuh.
      await fetch(url + '/api/fonts').catch(() => null);
      return url;
    }
  }
  throw new Error('Server tidak siap setelah 40 detik.');
}

async function api(url, options = {}) {
  const requestHeaders = Object.assign({}, headers, options.headers || {});
  const init = Object.assign({}, options, { headers: requestHeaders });
  if (options.json !== undefined) {
    requestHeaders['content-type'] = 'application/json';
    init.body = JSON.stringify(options.json);
  }
  const response = await fetch(base + url, init);
  return response.json();
}

function findSourceTtf() {
  const candidates = ['C:/Windows/Fonts/tahoma.ttf', 'C:/Windows/Fonts/arial.ttf', 'C:/Windows/Fonts/segoeui.ttf'];
  for (const file of candidates) {
    if (fs.existsSync(file)) return file;
  }
  const dir = 'C:/Windows/Fonts';
  const found = fs.readdirSync(dir).find((f) => f.toLowerCase().endsWith('.ttf'));
  return found ? path.join(dir, found) : null;
}

function snapshotCollector(progressId, snapshots) {
  return setInterval(async () => {
    try {
      const data = await api(`/api/progress/${progressId}`);
      if (data.progress) {
        snapshots.push({
          at: Date.now(),
          phase: data.progress.phase,
          progress: Math.round(data.progress.progress * 100),
          completed: data.progress.completed,
          total: data.progress.total,
          items: data.progress.items.map((i) => `${i.status}:${i.detail}`)
        });
      }
    } catch {
      /* abaikan */
    }
  }, 120);
}

function printSnapshots(snapshots) {
  console.log(`  snapshot selama proses: ${snapshots.length}`);
  const seen = new Set();
  for (const s of snapshots) {
    const key = `${s.phase}|${s.progress}|${s.completed}|${s.items.join(',')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log('  ', s.phase, s.progress + '%', `${s.completed}/${s.total}`, s.items.join(' | '));
  }
}

async function cleanupTestBackups(fileName) {
  const backupList = await api('/api/backups');
  for (const item of backupList.items || []) {
    if (item.fileName === fileName) {
      await api(`/api/backups/${item.id}`, { method: 'DELETE' });
    }
  }
}

async function installBytes(bytes, name) {
  const response = await fetch(`${base}/api/install?filename=${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { ...headers, 'content-type': 'application/octet-stream' },
    body: bytes
  });
  return response.json();
}

async function main() {
  base = await ensureServer();
  const source = findSourceTtf();
  if (!source) throw new Error('Tidak ada font contoh di C:/Windows/Fonts.');
  const bytes = fs.readFileSync(source);
  console.log('server:', base);
  console.log('sumber:', source, bytes.length, 'bytes');

  // ---------------------------------------------------------- 1. hapus single
  const fileName1 = `fmprog1-${Date.now()}.ttf`;
  const install1 = await installBytes(bytes, fileName1);
  console.log('install #1 ok:', install1.ok, install1.installed && install1.installed.id);
  if (!install1.ok) throw new Error('install #1 gagal: ' + JSON.stringify(install1));

  const progressId1 = `test1-${Date.now()}`;
  const snaps1 = [];
  const poll1 = snapshotCollector(progressId1, snaps1);
  const delete1 = await api(
    `/api/fonts/${install1.installed.id}?backup=1&progressId=${encodeURIComponent(progressId1)}`,
    { method: 'DELETE' }
  );
  clearInterval(poll1);
  console.log('delete single ok:', delete1.ok, 'backup:', JSON.stringify(delete1.backup || null).slice(0, 80));
  if (!delete1.ok || !delete1.backup) throw new Error('hapus single gagal: ' + JSON.stringify(delete1));
  const final1 = await api(`/api/progress/${progressId1}`);
  printSnapshots(snaps1);
  console.log('  final:', JSON.stringify(final1.progress && final1.progress.items));
  if (!final1.progress || final1.progress.total !== 1 || final1.progress.completed !== 1) {
    throw new Error('progress single tidak konsisten: ' + JSON.stringify(final1.progress));
  }

  // ---------------------------------------------------------- 2. pulihkan
  const progressId3 = `test3-${Date.now()}`;
  const restore = await api(`/api/backups/${delete1.backup.id}/restore`, {
    method: 'POST',
    json: { progressId: progressId3 }
  });
  const restoredPath = restore.restored && restore.restored.originalPath;
  console.log('restore ok:', restore.ok, 'lokasi:', restoredPath);
  if (!restore.ok || !restoredPath) throw new Error('pemulihan gagal: ' + JSON.stringify(restore));
  if (!fs.existsSync(restoredPath)) throw new Error('berkas hasil pulih tidak ada: ' + restoredPath);
  const final3 = await api(`/api/progress/${progressId3}`);
  if (!final3.progress || final3.progress.total !== 1 || final3.progress.completed !== 1) {
    throw new Error('progress pulih tidak konsisten: ' + JSON.stringify(final3.progress));
  }
  // Kembalikan ke kondisi bersih: hapus berkas yang baru dipulihkan.
  const redelete = await api(`/api/fonts/${install1.installed.id}?backup=0`, { method: 'DELETE' });
  if (!redelete.ok) throw new Error('penghapusan setelah pulih gagal: ' + JSON.stringify(redelete));

  // ---------------------------------------------------------- 3. hapus batch
  const stamp = Date.now();
  const ids = [];
  for (let i = 0; i < 3; i++) {
    const name = `fmprogb${stamp}-${i}.ttf`;
    const inst = await installBytes(bytes, name);
    if (!inst.ok) throw new Error(`install batch #${i} gagal: ` + JSON.stringify(inst));
    ids.push(inst.installed.id);
    await cleanupTestBackups(name);
  }
  console.log('batch ids:', ids.join(', '));

  const progressId2 = `test2-${Date.now()}`;
  const snaps2 = [];
  const poll2 = snapshotCollector(progressId2, snaps2);
  const delete2 = await api('/api/fonts/delete-batch', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ids, backup: true, progressId: progressId2 })
  });
  clearInterval(poll2);
  console.log('delete batch ok:', delete2.ok, 'count:', delete2.count, 'fileCount:', delete2.fileCount);
  const final2 = await api(`/api/progress/${progressId2}`);
  printSnapshots(snaps2);
  console.log(
    '  final:',
    final2.progress && final2.progress.completed + '/' + final2.progress.total,
    (final2.progress ? final2.progress.items : []).map((i) => `${i.name}=${i.status}`).join(' | ')
  );
  if (!final2.progress || final2.progress.total !== 3 || final2.progress.completed !== 3) {
    throw new Error('progress batch tidak konsisten: ' + JSON.stringify(final2.progress));
  }

  // ---------------------------------------------------------- 4. bersihkan
  for (let i = 0; i < 3; i++) {
    await cleanupTestBackups(`fmprogb${stamp}-${i}.ttf`);
  }
  await cleanupTestBackups(fileName1);
  const backupList = await api('/api/backups');
  console.log('sisa cadangan setelah bersih:', (backupList.items || []).length);

  console.log('PROGRESS API TEST OK');
}

main()
  .catch((error) => {
    console.error('GAGAL:', error.message);
    console.error(error.stack);
    process.exitCode = 1;
  })
  .finally(() => {
    if (ownedServer && ownedServer.exitCode === null) {
      try {
        ownedServer.kill();
      } catch {
        /* abaikan */
      }
    }
  });
