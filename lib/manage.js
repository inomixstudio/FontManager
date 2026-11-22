'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');

const registry = require('./registry');
const store = require('./store');
const scanner = require('./scanner');
const { parseFontBuffer, titleFromFileName } = require('./fontParser');

const INSTALL_EXTS = new Set(['.ttf', '.otf', '.ttc', '.otc']);
const MAX_INSTALL_BYTES = 128 * 1024 * 1024;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function fail(status, message) {
  return new HttpError(status, message);
}

function sha1(buffer) {
  return crypto.createHash('sha1').update(buffer).digest('hex');
}

function isWithinHome(target) {
  return scanner.isInside(target, os.homedir());
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/* ----------------------------------------------------------- PS executor */

function buildScript(ops, logPath) {
  const lines = [];
  lines.push(`$ErrorActionPreference = 'Stop'`);
  lines.push(`$logPath = ${registry.psQuote(logPath)}`);
  lines.push(`
function Add-Result([string]$op, [string]$target, [bool]$ok, [string]$err, [int]$idx = -1) {
  $entry = [pscustomobject]@{ op = $op; target = $target; ok = $ok; error = $err; idx = $idx }
  Add-Content -LiteralPath $logPath -Value (ConvertTo-Json -InputObject $entry -Compress) -Encoding UTF8
}
function Get-RegRoot([string]$key) {
  if ($key.StartsWith('HKCU:', [System.StringComparison]::OrdinalIgnoreCase)) {
    return [Microsoft.Win32.Registry]::CurrentUser
  }
  if ($key.StartsWith('HKLM:', [System.StringComparison]::OrdinalIgnoreCase)) {
    return [Microsoft.Win32.Registry]::LocalMachine
  }
  return $null
}
function Get-RegSubPath([string]$key) {
  $index = $key.IndexOf(':')
  if ($index -lt 0) { return $null }
  return $key.Substring($index + 1).TrimStart([char]92)
}
function Remove-FontReg([string]$key, [string]$name, [int]$idx = -1) {
  $root = Get-RegRoot $key
  $subPath = Get-RegSubPath $key
  if (-not $root -or -not $subPath) {
    Add-Result 'reg' ($key + '|' + $name) $false 'Kunci registri tidak didukung.' $idx
    return
  }

  # Gunakan Registry API agar nama nilai diperlakukan persis (tanpa wildcard)
  # dan ulangi beberapa kali bila Windows Font Cache masih memegang nilainya.
  $lastError = ''
  for ($attempt = 1; $attempt -le 4; $attempt++) {
    $subKey = $null
    try {
      $subKey = $root.OpenSubKey($subPath, $true)
      if (-not $subKey) {
        Add-Result 'reg' ($key + '|' + $name) $true '' $idx
        return
      }
      if ($subKey.GetValueNames() -notcontains $name) {
        Add-Result 'reg' ($key + '|' + $name) $true '' $idx
        return
      }
      $subKey.DeleteValue($name, $false)
      if ($subKey.GetValueNames() -notcontains $name) {
        Add-Result 'reg' ($key + '|' + $name) $true '' $idx
        return
      }
      $lastError = 'Nilai registri masih ada setelah operasi hapus.'
    } catch {
      $lastError = $_.Exception.Message
    } finally {
      if ($subKey) { $subKey.Close() }
    }
    Start-Sleep -Milliseconds (80 * $attempt)
  }
  Add-Result 'reg' ($key + '|' + $name) $false $lastError $idx
}
function Add-FontReg([string]$key, [string]$name, [string]$value, [int]$idx = -1) {
  try {
    $root = Get-RegRoot $key
    $subPath = Get-RegSubPath $key
    if (-not $root -or -not $subPath) {
      throw 'Kunci registri tidak didukung.'
    }
    $subKey = $root.CreateSubKey($subPath)
    if (-not $subKey) { throw 'Tidak dapat membuka kunci registri.' }
    try {
      $subKey.SetValue($name, $value, [Microsoft.Win32.RegistryValueKind]::String)
    } finally {
      $subKey.Close()
    }
    Add-Result 'regadd' ($key + '|' + $name) $true '' $idx
  } catch {
    Add-Result 'regadd' ($key + '|' + $name) $false $_.Exception.Message $idx
  }
}
function Remove-FontFile([string]$target, [int]$idx = -1) {
  if (-not (Test-Path -LiteralPath $target)) {
    Add-Result 'file' $target $true '' $idx
    return
  }
  $lastError = ''
  for ($attempt = 1; $attempt -le 5; $attempt++) {
    try {
      Remove-Item -LiteralPath $target -Force -ErrorAction Stop
    } catch {
      $lastError = $_.Exception.Message
    }
    # Nilai keberhasilan ditentukan oleh kondisi akhir: bila berkas sudah
    # hilang (mis. terhapus oleh Windows saat entri registri dilepas, atau
    # delete-pending), tujuan penghapusan sudah tercapai.
    if (-not (Test-Path -LiteralPath $target)) {
      Add-Result 'file' $target $true '' $idx
      return
    }
    if (-not $lastError) { $lastError = 'Berkas masih ada setelah operasi hapus.' }
    Start-Sleep -Milliseconds (120 * $attempt)
  }
  if (Test-Path -LiteralPath $target) {
    Add-Result 'file' $target $false $lastError $idx
  } else {
    Add-Result 'file' $target $true '' $idx
  }
}
function Copy-FontFile([string]$source, [string]$target, [int]$idx = -1) {
  try {
    $parent = [System.IO.Path]::GetDirectoryName($target)
    if ($parent -and -not [System.IO.Directory]::Exists($parent)) {
      [void][System.IO.Directory]::CreateDirectory($parent)
    }
    Copy-Item -LiteralPath $source -Destination $target -Force -ErrorAction Stop
    Add-Result 'copy' ($source + ' -> ' + $target) $true '' $idx
  } catch {
    Add-Result 'copy' ($source + ' -> ' + $target) $false $_.Exception.Message $idx
  }
}
`);

  const idxArg = (item) => {
    const idx = item && typeof item.idx === 'number' ? item.idx : -1;
    return idx >= 0 ? ' ' + registry.psQuote(String(idx)) : '';
  };

  for (const item of ops.removeRegs || []) {
    lines.push(
      `Remove-FontReg ${registry.psQuote(item.key)} ${registry.psQuote(item.name)}${idxArg(item)}`
    );
  }
  for (const raw of ops.removeFiles || []) {
    const file = typeof raw === 'string' ? { path: raw } : raw;
    lines.push(`Remove-FontFile ${registry.psQuote(file.path)}${idxArg(file)}`);
  }
  for (const item of ops.copyFiles || []) {
    lines.push(
      `Copy-FontFile ${registry.psQuote(item.src)} ${registry.psQuote(item.dst)}${idxArg(item)}`
    );
  }
  for (const item of ops.addRegs || []) {
    lines.push(
      `Add-FontReg ${registry.psQuote(item.key)} ${registry.psQuote(item.name)} ${registry.psQuote(item.value)}${idxArg(item)}`
    );
  }
  lines.push(`Add-Content -LiteralPath $logPath -Value '{"done":true}' -Encoding UTF8`);

  return lines.join('\r\n');
}

function readLog(logPath) {
  try {
    const raw = fs.readFileSync(logPath, 'utf8').replace(/^\uFEFF/, '').trim();
    if (!raw) return null;

    // Format lama: satu JSON utuh (array/objek) di akhir operasi.
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      // Objek tunggal tanpa `op` (mis. penanda {"done":true}) bukan hasil operasi.
      if (parsed && typeof parsed === 'object' && parsed.op) return [parsed];
    } catch {
      /* bukan JSON utuh; lanjut ke pembacaan JSONL */
    }

    // Format baru: satu objek JSON per baris (ditulis inkremental).
    const entries = [];
    for (const line of raw.split(/\r?\n/)) {
      const text = line.replace(/^\uFEFF/, '').trim();
      if (!text) continue;
      try {
        const parsed = JSON.parse(text);
        if (parsed && parsed.op) entries.push(parsed);
      } catch {
        /* baris belum lengkap; diabaikan */
      }
    }
    return entries.length ? entries : null;
  } catch {
    return null;
  }
}

function cleanupTemp(files) {
  for (const file of files) {
    try {
      if (file && fs.existsSync(file)) fs.unlinkSync(file);
    } catch {
      /* abaikan */
    }
  }
}

/* --------------------------------------------- progres operasi (live) */

const progressOps = new Map();
const PROGRESS_TTL_MS = 120000;

function normalizeProgressId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{4,48}$/.test(value) ? value : null;
}

function sweepProgress() {
  const now = Date.now();
  for (const [key, entry] of progressOps) {
    if (entry.done && entry.finishedAt && now - entry.finishedAt > PROGRESS_TTL_MS) {
      progressOps.delete(key);
    }
  }
}

function beginProgress(id, items, options = {}) {
  if (!id) return null;
  sweepProgress();
  const stages = options.stages === 1 ? 1 : 2;
  const entry = {
    id,
    phase: 'preparing',
    phaseText: 'Menyiapkan operasi…',
    startedAt: Date.now(),
    finishedAt: null,
    stages,
    doneDetail: options.doneDetail || 'Selesai',
    total: items.length,
    ok: null,
    error: null,
    done: false,
    items: items.map((item, index) => ({
      index,
      id: String(item.id == null ? index : item.id),
      name: item.name || `Berkas ${index + 1}`,
      meta: item.meta || '',
      status: 'pending',
      detail: '',
      backupDone: stages === 1,
      scriptDone: false,
      opsTotal: 0,
      opsDone: 0,
      hadError: false
    }))
  };
  progressOps.set(id, entry);
  return entry;
}

function progressEntry(id) {
  return (id && progressOps.get(id)) || null;
}

function setProgressPhase(id, phase, phaseText) {
  const entry = progressEntry(id);
  if (!entry) return;
  entry.phase = phase;
  if (phaseText) entry.phaseText = phaseText;
}

function setProgressItem(id, index, status, detail, stage) {
  const entry = progressEntry(id);
  if (!entry) return;
  const item = entry.items[index];
  if (!item) return;
  item.status = status;
  item.detail = detail || '';
  if (stage === 'backup' && status !== 'busy') item.backupDone = true;
}

function setProgressOps(id, index, opsTotal, doneDetail) {
  const entry = progressEntry(id);
  if (!entry) return;
  const item = entry.items[index];
  if (!item) return;
  item.opsTotal = opsTotal;
  if (doneDetail) item.doneDetail = doneDetail;
  if (opsTotal <= 0) {
    item.scriptDone = true;
    item.status = 'done';
    item.detail = item.doneDetail || 'Selesai';
  }
}

function applyScriptResult(id, result) {
  const entry = progressEntry(id);
  if (!entry || typeof result.idx !== 'number' || result.idx < 0) return;
  const item = entry.items[result.idx];
  if (!item) return;
  item.opsDone += 1;
  if (result.ok === false) item.hadError = true;
  if (item.opsDone >= Math.max(1, item.opsTotal)) {
    item.scriptDone = true;
    item.status = item.hadError ? 'fail' : 'done';
    item.detail = item.hadError ? (result.error || 'Gagal') : item.doneDetail || entry.doneDetail;
  } else {
    item.status = 'busy';
    item.detail = item.hadError ? 'Sebagian gagal…' : 'Menghapus…';
  }
}

function finishProgress(id, ok, error) {
  const entry = progressEntry(id);
  if (!entry) return;
  entry.done = true;
  entry.ok = ok;
  entry.error = error || null;
  entry.phase = ok ? 'done' : 'error';
  entry.phaseText = ok ? 'Operasi selesai.' : error || 'Operasi gagal.';
  entry.finishedAt = Date.now();
  for (const item of entry.items) {
    if (item.status !== 'done' && item.status !== 'fail') {
      item.status = ok ? 'done' : 'fail';
      item.detail = ok ? entry.doneDetail : 'Gagal';
    }
    item.backupDone = true;
    item.scriptDone = true;
  }
}

function getProgress(id) {
  const entry = progressEntry(normalizeProgressId(id));
  if (!entry) return null;
  sweepProgress();

  let units = 0;
  const weight = 1 / entry.stages;
  for (const item of entry.items) {
    if (entry.stages === 2 && item.backupDone) units += weight;
    if (item.scriptDone) units += weight;
  }
  const completed = entry.items.filter((item) => item.status === 'done' || item.status === 'fail').length;

  return {
    id: entry.id,
    phase: entry.phase,
    phaseText: entry.phaseText,
    total: entry.total,
    completed,
    progress: entry.done ? 1 : entry.total ? Math.min(0.99, units / entry.total) : 0,
    done: entry.done,
    ok: entry.ok,
    error: entry.error,
    items: entry.items.map((item) => ({
      id: item.id,
      name: item.name,
      meta: item.meta,
      status: item.status,
      detail: item.detail
    }))
  };
}

async function runScript(ops, options = {}) {
  const opCount =
    (ops.removeRegs || []).length +
    (ops.removeFiles || []).length +
    (ops.copyFiles || []).length +
    (ops.addRegs || []).length;
  if (opCount === 0) {
    // Tidak ada yang perlu dijalankan; jangan panggil PowerShell.
    return { ok: true, elevated: !!options.elevated, canceled: false, results: [], error: null };
  }
  const elevated = !!options.elevated;
  const id = `${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
  const scriptPath = path.join(os.tmpdir(), `fm-font-${id}.ps1`);
  const logPath = path.join(os.tmpdir(), `fm-font-${id}.json`);
  const body = buildScript(ops, logPath);

  try {
    fs.writeFileSync(scriptPath, '\uFEFF' + body, 'utf8');
  } catch (error) {
    throw fail(500, 'Tidak dapat menulis skrip sementara: ' + error.message);
  }

  // Pantau log inkremental agar progres tiap font bisa dilaporkan selama
  // skrip berjalan (termasuk saat menunggu persetujuan UAC).
  const onResult = typeof options.onResult === 'function' ? options.onResult : null;
  const seenResults = new Set();
  let pollTimer = null;
  if (onResult) {
    pollTimer = setInterval(() => {
      for (const entry of readLog(logPath) || []) {
        const key = `${entry.op}|${entry.target}|${entry.idx}`;
        if (seenResults.has(key)) continue;
        seenResults.add(key);
        try {
          onResult(entry);
        } catch {
          /* abaikan */
        }
      }
    }, 280);
    if (typeof pollTimer.unref === 'function') pollTimer.unref();
  }

  let run;
  try {
    if (elevated) {
      const launcher = [
        'Start-Process',
        '-FilePath \'powershell.exe\'',
        '-Verb RunAs',
        '-Wait',
        '-WindowStyle Hidden',
        `-ArgumentList @('-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',${registry.psQuote(scriptPath)})`
      ].join(' ');
      run = await registry.runPowerShell(launcher, { timeout: options.timeout || 180000 });
    } else {
      run = await registry.runPowerShellFile(scriptPath, { timeout: options.timeout || 180000 });
    }
  } finally {
    if (pollTimer) clearInterval(pollTimer);
  }

  // Baris penanda akhir ({"done":true}) bukan hasil operasi; buang agar
  // operasi tanpa daftar tidak dilaporkan gagal dengan pesan yang salah.
  const logged = readLog(logPath);
  const results = logged ? logged.filter((item) => item && item.op) : null;
  cleanupTemp([scriptPath, logPath]);

  const output = `${run.stdout || ''}\n${run.stderr || ''}`;
  const canceled = !results && /cancel|dibatalkan|abgebrochen|annul/i.test(output);
  if (!results) {
    return {
      ok: false,
      elevated,
      canceled,
      results: [],
      error: canceled
        ? 'Izin Administrator dibatalkan. Tidak ada perubahan yang dilakukan.'
        : registry.cleanError(run.stderr) || registry.cleanError(run.stdout) || 'Operasi tidak dapat dijalankan.'
    };
  }

  const failed = results.filter((item) => !item.ok);
  const ok = failed.length === 0;
  return {
    ok,
    elevated,
    canceled: false,
    results,
    error: ok
      ? null
      : failed
          .map((item) => `${item.op === 'file' ? 'Berkas' : item.op === 'copy' ? 'Salin' : 'Registri'} ${item.target}: ${item.error}`)
          .join(' · ')
  };
}

/* --------------------------------------------------------------- backups */

function createBackup(font) {
  if (!font.exists) return null;

  store.ensureDir(store.BACKUP_DIR);

  const id = `${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
  const ext = path.extname(font.filePath) || '.font';
  const storedName = `${id}${ext}`;
  const destination = path.join(store.BACKUP_DIR, storedName);

  let size = font.size;
  try {
    fs.copyFileSync(font.filePath, destination);
    size = fs.statSync(destination).size;
  } catch (error) {
    throw fail(
      500,
      'Gagal membuat cadangan sebelum menghapus: ' + error.message + '. Font tidak dihapus demi keamanan.'
    );
  }

  const entry = {
    id,
    file: storedName,
    fileName: font.fileName,
    family: font.family,
    subfamily: font.subfamily,
    originalPath: font.filePath,
    size,
    source: font.source,
    protected: !!font.protected,
    registry: (font.registry || []).map((item) => ({
      key: item.key,
      name: item.name,
      value: item.value
    })),
    deletedAt: new Date().toISOString()
  };
  store.addBackup(entry);
  return entry;
}

/* ---------------------------------------------------------------- delete */

async function deleteFont(font, options = {}) {
  if (!font) throw fail(404, 'Font tidak ditemukan.');
  const makeBackup = options.backup !== false;
  const progressId = normalizeProgressId(options.progressId);
  const progress = beginProgress(
    progressId,
    [
      {
        id: font.id,
        name: font.fileName || font.family || 'Font',
        meta: font.subfamily || ''
      }
    ],
    { stages: 2, doneDetail: 'Dihapus' }
  );

  let backup = null;
  try {
    if (progress) setProgressPhase(progress.id, 'backup', `Mencadangkan ${font.fileName || 'font'}…`);
    if (font.exists && makeBackup) {
      if (progress) setProgressItem(progress.id, 0, 'busy', 'Mencadangkan…', 'backup');
      backup = createBackup(font);
    }
    if (progress) {
      setProgressItem(
        progress.id,
        0,
        'pending',
        font.exists ? (makeBackup ? 'Tercadangkan' : 'Tanpa cadangan') : 'Entri registri',
        'backup'
      );
    }
  } catch (error) {
    if (progress) finishProgress(progress.id, false, error.message);
    throw error;
  }

  const removeRegs = (font.registry || []).map((item) => ({
    key: item.key,
    name: item.name,
    idx: 0
  }));
  const removeFiles = font.exists ? [{ path: font.filePath, idx: 0 }] : [];

  if (!removeRegs.length && !removeFiles.length) {
    if (progress) finishProgress(progress.id, false, 'Tidak ada berkas atau entri registri yang dapat dihapus.');
    throw fail(400, 'Tidak ada berkas atau entri registri yang dapat dihapus.');
  }

  const needsAdmin =
    (font.registry || []).some((item) => item.root === 'HKLM') ||
    (font.exists && !isWithinHome(font.filePath));

  if (progress) {
    setProgressPhase(progress.id, 'script', 'Menghapus berkas dan entri registri…');
    setProgressOps(progress.id, 0, removeRegs.length + removeFiles.length, 'Dihapus');
  }

  const rawResult = await runScript(
    { removeRegs, removeFiles },
    {
      elevated: needsAdmin,
      timeout: scriptTimeoutFor(removeRegs.length + removeFiles.length),
      onResult: progress ? (entry) => applyScriptResult(progress.id, entry) : null
    }
  );
  await sweepRemovedFiles(removeFiles);
  const result = reconcileFileResults(rawResult, removeFiles);
  scanner.invalidateScan();
  if (progress) {
    applyFinalResults(progress.id, result.results);
    finishProgress(progress.id, result.ok, result.error);
  }

  if (result.ok) {
    try {
      store.setTracked(font.id, false);
    } catch {
      /* abaikan */
    }
  }

  return {
    ...result,
    backup: backup ? { id: backup.id, fileName: backup.fileName } : null,
    needsAdmin,
    font: {
      id: font.id,
      family: font.family,
      subfamily: font.subfamily,
      fileName: font.fileName
    }
  };
}

async function deleteFonts(fonts, options = {}) {
  const list = (fonts || []).filter(Boolean);
  if (!list.length) throw fail(400, 'Tidak ada font yang dipilih untuk dihapus.');

  const makeBackup = options.backup !== false;
  const progressId = normalizeProgressId(options.progressId);
  const progress = beginProgress(
    progressId,
    list.map((font, index) => ({
      id: font.id,
      name: font.fileName || font.family || `Font ${index + 1}`,
      meta: [font.subfamily, font.family && font.family !== font.subfamily ? font.family : '']
        .filter(Boolean)
        .join(' · ')
    })),
    { stages: 2, doneDetail: 'Dihapus' }
  );

  const backups = [];
  const backedUpPaths = new Set();

  try {
    for (let index = 0; index < list.length; index++) {
      const font = list[index];
      if (progress) {
        setProgressPhase(progress.id, 'backup', `Mencadangkan ${font.fileName || font.family || 'font'}…`);
      }
      if (font.exists && makeBackup && !backedUpPaths.has(font.filePath)) {
        if (progress) setProgressItem(progress.id, index, 'busy', 'Mencadangkan…', 'backup');
        backedUpPaths.add(font.filePath);
        const entry = createBackup(font);
        if (entry) backups.push({ ...entry, fontId: font.id });
      }
      if (progress) {
        setProgressItem(
          progress.id,
          index,
          'pending',
          font.exists ? (makeBackup ? 'Tercadangkan' : 'Tanpa cadangan') : 'Entri registri',
          'backup'
        );
      }
    }
  } catch (error) {
    for (const item of backups) {
      try {
        store.removeBackup(item.id);
      } catch {
        /* abaikan */
      }
    }
    if (progress) finishProgress(progress.id, false, error.message);
    throw error;
  }

  const removeRegs = [];
  const seen = new Set();
  const removeFiles = [];
  const removePaths = new Set();
  let needsAdmin = false;

  for (let index = 0; index < list.length; index++) {
    const font = list[index];
    for (const item of font.registry || []) {
      const key = `${item.key}|${item.name}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      removeRegs.push({ key: item.key, name: item.name, idx: index });
    }
    if (font.exists && !removePaths.has(font.filePath)) {
      removePaths.add(font.filePath);
      removeFiles.push({ path: font.filePath, idx: index });
    }
    if (
      (font.registry || []).some((item) => item.root === 'HKLM') ||
      (font.exists && !isWithinHome(font.filePath))
    ) {
      needsAdmin = true;
    }
  }

  const opsByItem = new Array(list.length).fill(0);
  for (const reg of removeRegs) if (reg.idx >= 0) opsByItem[reg.idx] += 1;
  for (const file of removeFiles) if (file.idx >= 0) opsByItem[file.idx] += 1;

  if (progress) {
    setProgressPhase(
      progress.id,
      'script',
      `Menghapus ${removeFiles.length} berkas dan ${removeRegs.length} entri registri…`
    );
    for (let index = 0; index < list.length; index++) {
      setProgressOps(progress.id, index, opsByItem[index], 'Dihapus');
    }
  }

  const rawResult = await runScript(
    { removeRegs, removeFiles },
    {
      elevated: needsAdmin,
      timeout: scriptTimeoutFor(removeRegs.length + removeFiles.length),
      onResult: progress ? (entry) => applyScriptResult(progress.id, entry) : null
    }
  );
  await sweepRemovedFiles(removeFiles);
  const result = reconcileFileResults(rawResult, removeFiles);
  scanner.invalidateScan();
  if (progress) {
    applyFinalResults(progress.id, result.results);
    finishProgress(progress.id, result.ok, result.error);
  }

  if (result.ok) {
    for (const font of list) {
      try {
        store.setTracked(font.id, false);
      } catch {
        /* abaikan */
      }
    }
  }

  const fileGone = new Map();
  for (const file of removeFiles) {
    let exists = true;
    try {
      exists = fs.existsSync(file.path);
    } catch {
      exists = true;
    }
    fileGone.set(file.path, !exists);
  }

  return {
    ...result,
    needsAdmin,
    count: list.length,
    fileCount: removeFiles.length,
    backups: backups.map((item) => ({ id: item.id, fileName: item.fileName, fontId: item.fontId })),
    deleted: list
      .filter((font) => !font.exists || fileGone.get(font.filePath) === true)
      .map((font) => ({
        id: font.id,
        family: font.family,
        subfamily: font.subfamily,
        fileName: font.fileName
      }))
  };
}

/* --------------------------------------------------------------- install */

function sanitizeFileName(name) {
  const base = path.basename(String(name || 'font')).replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_');
  const trimmed = base.replace(/^\.+/, '').slice(0, 120);
  return trimmed || `font-${Date.now()}`;
}

function uniqueFilePath(dir, fileName) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  let candidate = path.join(dir, fileName);
  let index = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(dir, `${base} (${index})${ext}`);
    index++;
    if (index > 500) throw fail(409, 'Terlalu banyak berkas dengan nama serupa.');
  }
  return candidate;
}

function uniqueValueName(existingNames, base) {
  const taken = new Set(existingNames.map((name) => String(name).toLowerCase()));
  let candidate = base;
  let index = 2;
  while (taken.has(candidate.toLowerCase())) {
    candidate = `${base} ${index}`;
    index++;
  }
  return candidate;
}

async function installFont(buffer, originalName) {
  if (!buffer || !buffer.length) throw fail(400, 'Berkas font kosong.');
  if (buffer.length > MAX_INSTALL_BYTES) throw fail(413, 'Ukuran berkas melebihi 128 MB.');

  const safeName = sanitizeFileName(originalName || 'font.ttf');
  const ext = path.extname(safeName).toLowerCase();
  if (!INSTALL_EXTS.has(ext)) {
    throw fail(415, 'Format tidak didukung. Gunakan .ttf, .otf, .ttc, atau .otc.');
  }

  const meta = parseFontBuffer(buffer, safeName);
  const dir = scanner.userFontsDir();
  store.ensureDir(dir);
  const targetPath = uniqueFilePath(dir, safeName);

  try {
    fs.writeFileSync(targetPath, buffer);
  } catch (error) {
    throw fail(500, 'Gagal menyimpan berkas font: ' + error.message);
  }

  const currentRegistry = await registry.readRegistryFonts();
  const existingNames = currentRegistry.entries.map((item) => item.name);
  const kind = ext === '.otf' || ext === '.otc' ? 'OpenType' : 'TrueType';
  const label = meta.fullName || meta.family || titleFromFileName(safeName);
  const valueName = uniqueValueName(existingNames, `${label} (${kind})`);

  const result = await runScript(
    {
      addRegs: [
        {
          key: registry.FONT_REG_KEY_HKCU,
          name: valueName,
          value: targetPath
        }
      ]
    },
    { elevated: false }
  );

  if (!result.ok) {
    // Bersihkan sisa pendaftaran yang mungkin sudah terlanjur dibuat.
    try {
      await runScript(
        { removeRegs: [{ key: registry.FONT_REG_KEY_HKCU, name: valueName }] },
        { elevated: false }
      );
    } catch {
      /* abaikan */
    }
    try {
      fs.unlinkSync(targetPath);
    } catch {
      /* abaikan */
    }
    scanner.invalidateScan();
    throw fail(500, 'Font gagal didaftarkan: ' + (result.error || 'kesalahan registri'));
  }

  scanner.invalidateScan();

  return {
    ok: true,
    installed: {
      id: scanner.makeId(targetPath),
      family: meta.family,
      subfamily: meta.subfamily,
      fileName: path.basename(targetPath),
      filePath: targetPath,
      registryName: valueName,
      size: buffer.length,
      format: meta.format
    },
    warnings: parserWarnings(meta)
  };
}

function parserWarnings(meta) {
  const warnings = [];
  if (!meta.family) warnings.push('Nama keluarga font tidak terbaca, memakai nama berkas.');
  if (meta.parserOk === false) warnings.push('Struktur font tidak sepenuhnya dikenali.');
  return warnings;
}

/* --------------------------------------------------------------- restore */

async function restoreBackup(id, options = {}) {
  const entry = store.getBackup(id);
  if (!entry) throw fail(404, 'Cadangan tidak ditemukan.');
  if (!entry.originalPath) throw fail(400, 'Lokasi asli cadangan tidak diketahui.');
  const progressId = normalizeProgressId(options.progressId);

  const source = path.join(store.BACKUP_DIR, entry.file);
  if (!fs.existsSync(source)) throw fail(410, 'Berkas cadangan sudah tidak tersedia.');
  if (fs.existsSync(entry.originalPath)) {
    throw fail(409, 'Berkas font sudah ada di lokasi aslinya. Pulihkan dibatalkan.');
  }

  const regs = (entry.registry || []).filter((item) => item.key && item.name);
  const needsAdmin =
    regs.some((item) => item.root === 'HKLM') ||
    !isWithinHome(entry.originalPath) ||
    scanner.isInside(entry.originalPath, scanner.systemFontsDir());

  const restoreLabel = entry.family || entry.fileName || 'font';
  const progress = beginProgress(
    progressId,
    [{ id: entry.id, name: restoreLabel, meta: entry.subfamily || '' }],
    { stages: 1, doneDetail: 'Dipulihkan' }
  );
  if (progress) {
    setProgressPhase(progress.id, 'script', `Memulihkan ${restoreLabel} ke lokasi aslinya…`);
    setProgressOps(progress.id, 0, 1 + regs.length, 'Dipulihkan');
    setProgressItem(progress.id, 0, 'busy', 'Memulihkan…');
  }

  const result = await runScript(
    {
      copyFiles: [{ src: source, dst: entry.originalPath, idx: 0 }],
      addRegs: regs.map((item) => ({ key: item.key, name: item.name, value: item.value, idx: 0 }))
    },
    {
      elevated: needsAdmin,
      onResult: progress ? (logEntry) => applyScriptResult(progress.id, logEntry) : null
    }
  );
  if (progress) finishProgress(progress.id, result.ok || copyOkish(result), result.error);

  const copyOk =
    result.ok ||
    (result.results || []).some((item) => item.op === 'copy' && item.ok);

  if (copyOk) {
    const item = { ...entry };
    try {
      store.removeBackup(id);
    } catch {
      // Berkas cadangan terkunci; biarkan entri tetap ada untuk dicoba lagi.
    }
    scanner.invalidateScan();
    return { ...result, restored: item, needsAdmin };
  }

  return { ...result, restored: null, needsAdmin };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Batas waktu skrip mengikuti jumlah operasi: batas tetap 180 detik dapat
 * tercapai pada hapus massal ribuan berkas meski prosesnya masih berjalan.
 */
function scriptTimeoutFor(ops) {
  return Math.min(900000, 180000 + (Number(ops) || 0) * 400);
}

/**
 * Verifikasi akhir penghapusan berkas dari sisi Node. Windows kadang membuat
 * berkas font yang baru didaftarkan "sementara tak terlihat" sesaat setelah
 * pendaftaran, sehingga skrip mengira berkas sudah hilang (atau sebaliknya).
 * Tujuan akhirnya sederhana: berkas tidak boleh ada lagi.
 */
async function sweepRemovedFiles(removeFiles) {
  const pending = (removeFiles || []).filter((file) => {
    try {
      return fs.existsSync(file.path);
    } catch {
      return true;
    }
  });
  if (!pending.length) return;

  await sleep(1200);
  for (const file of pending) {
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch {
      /* dibiarkan; akan dilaporkan oleh rekonsiliasi */
    }
  }
  // Percobaan kedua untuk kasus yang masih terkunci sesaat.
  await sleep(600);
  for (const file of pending) {
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch {
      /* dibiarkan */
    }
  }
}

/**
 * Samakan hasil log dengan kondisi akhir di disk: berkas yang masih ada
 * dilaporkan gagal, berkas yang sudah hilang dilaporkan berhasil.
 */
function reconcileFileResults(result, removeFiles) {
  const results = (result.results || []).map((item) => ({ ...item }));
  for (const file of removeFiles || []) {
    let exists = true;
    try {
      exists = fs.existsSync(file.path);
    } catch {
      exists = true;
    }
    const entry = results.find(
      (item) => item.op === 'file' && item.target === file.path && item.idx === file.idx
    );
    if (exists) {
      if (entry) {
        entry.ok = false;
        entry.error = entry.error || 'Berkas masih ada setelah operasi hapus.';
      } else {
        results.push({
          op: 'file',
          target: file.path,
          ok: false,
          error: 'Berkas masih ada setelah operasi hapus.',
          idx: file.idx
        });
      }
    } else if (entry && entry.ok === false) {
      entry.ok = true;
      entry.error = '';
    }
  }
  const ok = results.every((item) => item.ok !== false) && result.ok !== false;
  return { ...result, results, ok };
}

/** Terapkan hasil akhir ke item progres per berkas. */
function applyFinalResults(id, results) {
  const entry = progressEntry(id);
  if (!entry) return;
  const byIdx = new Map();
  for (const item of results || []) {
    if (typeof item.idx !== 'number' || item.idx < 0) continue;
    const arr = byIdx.get(item.idx) || [];
    arr.push(item);
    byIdx.set(item.idx, arr);
  }
  for (const [idx, arr] of byIdx) {
    const row = entry.items[idx];
    if (!row) continue;
    const failed = arr.find((item) => item.ok === false);
    row.scriptDone = true;
    row.status = failed ? 'fail' : 'done';
    row.detail = failed ? failed.error || 'Gagal' : row.doneDetail || entry.doneDetail;
    if (failed) row.hadError = true;
  }
}

function copyOkish(result) {
  return (result.results || []).some((item) => item.op === 'copy' && item.ok);
}

function removeBackup(id) {
  const entry = store.getBackup(id);
  if (!entry) throw fail(404, 'Cadangan tidak ditemukan.');
  try {
    store.removeBackup(id);
  } catch (error) {
    throw fail(500, error.message || 'Berkas cadangan masih terkunci dan belum dapat dihapus.');
  }
  return { ok: true };
}

async function revealInExplorer(font) {
  if (!font) throw fail(404, 'Font tidak ditemukan.');
  const target = font.exists ? font.filePath : font.dir;
  if (!fs.existsSync(target)) throw fail(404, 'Lokasi font tidak tersedia.');
  const args = font.exists ? ['/select,' + target] : [target];
  return new Promise((resolve) => {
    execFile('explorer.exe', args, { windowsHide: false }, () => resolve({ ok: true }));
    setTimeout(() => resolve({ ok: true }), 1200);
  });
}

module.exports = {
  HttpError,
  fail,
  getProgress,
  deleteFont,
  deleteFonts,
  installFont,
  restoreBackup,
  removeBackup,
  revealInExplorer,
  createBackup,
  runScript
};
