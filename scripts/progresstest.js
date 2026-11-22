/* Uji progres live: pasang salinan font, hapus (single + batch) sambil poll /api/progress/:id. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const PORT = process.env.FM_TEST_PORT || '59331';
const base = `http://127.0.0.1:${PORT}`;
const headers = { 'x-fm-request': '1' };

async function api(url, options = {}) {
  const response = await fetch(base + url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  return response.json();
}

function findSourceTtf() {
  const candidates = [
    'C:/Windows/Fonts/tahoma.ttf',
    'C:/Windows/Fonts/arial.ttf',
    'C:/Windows/Fonts/segoeui.ttf'
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) return file;
  }
  const dir = 'C:/Windows/Fonts';
  const found = fs.readdirSync(dir).find((f) => f.toLowerCase().endsWith('.ttf'));
  return path.join(dir, found);
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

async function main() {
  const source = findSourceTtf();
  const bytes = fs.readFileSync(source);
  console.log('sumber:', source, bytes.length, 'bytes');

  // ---------------------------------------------------------- 1. hapus single
  const fileName1 = `fmprog1-${Date.now()}.ttf`;
  const install1 = await (
    await fetch(`${base}/api/install?filename=${encodeURIComponent(fileName1)}`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/octet-stream' },
      body: bytes
    })
  ).json();
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
  console.log('delete single ok:', delete1.ok, 'backup:', JSON.stringify(delete1.backup || null).slice(0, 80), 'resp:', JSON.stringify(delete1).slice(0, 140), !!delete1.backup);
  const final1 = await api(`/api/progress/${progressId1}`);
  printSnapshots(snaps1);
  console.log('  final:', JSON.stringify(final1.progress && final1.progress.items));
  if (!final1.progress || final1.progress.total !== 1 || final1.progress.completed !== 1) {
    throw new Error('progress single tidak konsisten: ' + JSON.stringify(final1.progress));
  }

  // ---------------------------------------------------------- 2. hapus batch
  const stamp = Date.now();
  const ids = [];
  for (let i = 0; i < 3; i++) {
    const name = `fmprogb${stamp}-${i}.ttf`;
    const inst = await (
      await fetch(`${base}/api/install?filename=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: { ...headers, 'content-type': 'application/octet-stream' },
        body: bytes
      })
    ).json();
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
  console.log('delete batch ok:', delete2.ok, delete2.deleted, '/', delete2.requested);
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

  // ---------------------------------------------------------- 3. bersihkan
  for (let i = 0; i < 3; i++) {
    await cleanupTestBackups(`fmprogb${stamp}-${i}.ttf`);
  }
  await cleanupTestBackups(fileName1);
  const backupList = await api('/api/backups');
  console.log('sisa cadangan setelah bersih:', (backupList.items || []).length);

  console.log('PROGRESS API TEST OK');
}

main().catch((error) => {
  console.error('GAGAL:', error.message);
  console.error(error.stack);
  process.exit(1);
});
