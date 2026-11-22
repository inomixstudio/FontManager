'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TRACKED_FILE = path.join(DATA_DIR, 'tracked.json');
const BACKUPS_INDEX = path.join(DATA_DIR, 'backups.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

const MAX_BACKUPS = 300;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file, fallback) {
  try {
    const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  ensureDir(path.dirname(file));
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

/* ---------------------------------------------------------------- tracked */

function readTracked() {
  const data = readJson(TRACKED_FILE, { items: {} });
  if (!data.items || typeof data.items !== 'object' || Array.isArray(data.items)) {
    return { items: {} };
  }
  return data;
}

function setTracked(id, tracked, meta = {}) {
  const data = readTracked();
  if (tracked) {
    const prev = data.items[id] || {};
    data.items[id] = {
      id,
      family: meta.family || prev.family || '',
      subfamily: meta.subfamily || prev.subfamily || '',
      fileName: meta.fileName || prev.fileName || '',
      filePath: meta.filePath || prev.filePath || '',
      addedAt: prev.addedAt || new Date().toISOString()
    };
  } else {
    delete data.items[id];
  }
  data.updatedAt = new Date().toISOString();
  writeJson(TRACKED_FILE, data);
  return { tracked: !!tracked, items: data.items };
}

function setTrackedMany(items, tracked) {
  const data = readTracked();
  const now = new Date().toISOString();

  for (const item of items || []) {
    if (!item || !item.id) continue;
    if (tracked) {
      const prev = data.items[item.id] || {};
      const meta = item.meta || {};
      data.items[item.id] = {
        id: item.id,
        family: meta.family || prev.family || '',
        subfamily: meta.subfamily || prev.subfamily || '',
        fileName: meta.fileName || prev.fileName || '',
        filePath: meta.filePath || prev.filePath || '',
        addedAt: prev.addedAt || now
      };
    } else {
      delete data.items[item.id];
    }
  }

  data.updatedAt = now;
  writeJson(TRACKED_FILE, data);
  return { tracked: !!tracked, items: data.items };
}

function trackedMap() {
  return readTracked().items;
}

/* ---------------------------------------------------------------- backups */

function readBackupIndex() {
  const data = readJson(BACKUPS_INDEX, { items: [] });
  return Array.isArray(data.items) ? data : { items: [] };
}

function listBackups() {
  return readBackupIndex()
    .items.slice()
    .sort((a, b) => String(b.deletedAt).localeCompare(String(a.deletedAt)));
}

function addBackup(entry) {
  const data = readBackupIndex();
  data.items.unshift(entry);
  if (data.items.length > MAX_BACKUPS) {
    // Berkas cadangan yang tidak lagi tercantum di indeks ikut dihapus agar
    // folder backups tidak menimbun berkas yatim.
    const dropped = data.items.splice(MAX_BACKUPS);
    for (const item of dropped) {
      try {
        const file = path.join(BACKUP_DIR, item.file);
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch {
        /* berkas terkunci; akan tergantikan oleh pemangkasan berikutnya */
      }
    }
  }
  writeJson(BACKUPS_INDEX, data);
  return entry;
}

function getBackup(id) {
  return listBackups().find((item) => item.id === id) || null;
}

function removeBackup(id) {
  const data = readBackupIndex();
  const entry = data.items.find((item) => item.id === id) || null;
  if (!entry) return null;
  const file = path.join(BACKUP_DIR, entry.file);
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
    } catch {
      // Berkas masih terkunci (mis. dipakai sistem). Pertahankan entri indeks
      // agar cadangan tidak menjadi yatim dan tetap bisa dicoba lagi.
      const error = new Error('Berkas cadangan masih terkunci dan belum dapat dihapus.');
      error.code = 'BACKUP_LOCKED';
      throw error;
    }
  }
  data.items = data.items.filter((item) => item.id !== id);
  writeJson(BACKUPS_INDEX, data);
  return entry;
}

module.exports = {
  DATA_DIR,
  BACKUP_DIR,
  ensureDir,
  readJson,
  writeJson,
  readTracked,
  setTracked,
  setTrackedMany,
  trackedMap,
  listBackups,
  addBackup,
  getBackup,
  removeBackup
};
