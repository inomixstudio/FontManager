/* Uji unit tanpa dependensi untuk modul inti yang paling rawan regresi:
   parser sfnt dan penyimpanan cadangan/pelacakan. Dijalankan oleh `npm test`
   sebelum uji end-to-end. */
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { parseFontBuffer } = require('../lib/fontParser');
const store = require('../lib/store');
const i18n = require('../public/i18n.js');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ok -', name);
  } catch (error) {
    console.error('  GAGAL -', name);
    throw error;
  }
}

function firstExisting(list) {
  return list.find((file) => fs.existsSync(file)) || null;
}

function findFontDirFile(exts) {
  const dir = 'C:/Windows/Fonts';
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch {
    return null;
  }
  const name = names.find((item) => exts.includes(path.extname(item).toLowerCase()));
  return name ? path.join(dir, name) : null;
}

console.log('Uji unit');

test('parser menandai berkas sampah sebagai tidak dikenali', () => {
  const garbage = Buffer.from('ini bukan font, hanya teks. '.repeat(40));
  const meta = parseFontBuffer(garbage, 'sampah.ttf');
  assert.equal(meta.signature, 'unknown');
  assert.equal(meta.format, 'Tidak dikenali');
  assert.equal(meta.parserOk, false);
  assert.ok(meta.family.length > 0, 'nama familii jatuh ke nama berkas');
});

test('parser mengenali font TrueType asli', () => {
  const file = firstExisting(['C:/Windows/Fonts/arial.ttf', 'C:/Windows/Fonts/tahoma.ttf']);
  if (!file) {
    console.log('    (dilewati: tidak ada font contoh)');
    return;
  }
  const meta = parseFontBuffer(fs.readFileSync(file), path.basename(file));
  assert.ok(['ttf', 'true', 'OTTO', 'ttcf'].includes(meta.signature), 'signature: ' + meta.signature);
  assert.equal(meta.parserOk, true);
  assert.ok(meta.family && meta.family.length > 0, 'familii terbaca');
  assert.ok(meta.fullName && meta.fullName.length > 0);
});

test('parser mengenali koleksi TTC', () => {
  const file = findFontDirFile(['.ttc', '.otc']);
  if (!file) {
    console.log('    (dilewati: tidak ada berkas TTC/OTC)');
    return;
  }
  const meta = parseFontBuffer(fs.readFileSync(file), path.basename(file));
  assert.equal(meta.signature, 'ttcf');
  assert.equal(meta.isCollection, true);
  assert.ok(meta.collectionCount >= 1);
});

test('rekonsiliasi cadangan hanya menghapus berkas yatim pola generator', () => {
  store.ensureDir(store.BACKUP_DIR);
  const orphan = path.join(store.BACKUP_DIR, 'abcdef-123456.ttf');
  const keep = path.join(store.BACKUP_DIR, 'keepme.txt');
  fs.writeFileSync(orphan, 'orphan', 'utf8');
  fs.writeFileSync(keep, 'jangan dihapus', 'utf8');

  const indexedBefore = new Set(store.listBackups().map((item) => item.file));
  const removed = store.reconcileBackups();

  assert.ok(removed.includes('abcdef-123456.ttf'), 'yatim pola generator dihapus');
  assert.equal(fs.existsSync(orphan), false);
  assert.equal(fs.existsSync(keep), true, 'berkas di luar pola tidak disentuh');
  for (const file of indexedBefore) {
    assert.ok(fs.existsSync(path.join(store.BACKUP_DIR, file)), 'cadangan terindeks tetap ada: ' + file);
  }

  fs.unlinkSync(keep);
});

test('cadangan memakai ekstensi .ttf/.otf, bukan nama asli berkas', () => {
  const manage = require('../lib/manage');
  const scratch = path.join(os.tmpdir(), `fm-adobe-${process.pid}`);
  fs.writeFileSync(scratch, 'OTTO-bukan-font-asli', 'utf8');

  // Berkas Adobe di livetype tidak bernama: hanya angka tanpa ekstensi.
  const adobeFont = {
    exists: true,
    filePath: scratch,
    fileName: 'AM Tobruk Regular.otf',
    family: 'AM Tobruk',
    subfamily: 'Regular',
    type: 'OTF',
    size: fs.statSync(scratch).size,
    source: 'adobe',
    registry: []
  };
  const entry = manage.createBackup(adobeFont, { mode: 'manual' });
  assert.match(entry.file, /\.otf$/i, 'ekstensi cadangan Adobe: ' + entry.file);
  assert.ok(fs.existsSync(path.join(store.BACKUP_DIR, entry.file)), 'berkas cadangan ada');

  // Simulasikan hasil lama berekstensi `.font`, lalu normalisasi harus memperbaikinya.
  const renamed = entry.file.replace(/\.otf$/i, '.font');
  fs.renameSync(path.join(store.BACKUP_DIR, entry.file), path.join(store.BACKUP_DIR, renamed));
  const indexFile = path.join(store.DATA_DIR, 'backups.json');
  const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  index.items.find((item) => item.id === entry.id).file = renamed;
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), 'utf8');

  assert.equal(store.normalizeBackupFiles(), true, 'normalisasi melaporkan perubahan');
  assert.ok(fs.existsSync(path.join(store.BACKUP_DIR, entry.file)), 'berkas dinormalisasi ke ' + entry.file);
  assert.equal(fs.existsSync(path.join(store.BACKUP_DIR, renamed)), false);

  store.removeBackup(entry.id);
  fs.unlinkSync(scratch);
});

test('cadangan font sistem mempertahankan format standar', () => {
  const file = firstExisting(['C:/Windows/Fonts/arial.ttf', 'C:/Windows/Fonts/tahoma.ttf']);
  if (!file) {
    console.log('    (dilewati: tidak ada font contoh)');
    return;
  }
  const manage = require('../lib/manage');
  const stat = fs.statSync(file);
  const entry = manage.createBackup({
    exists: true,
    filePath: file,
    fileName: path.basename(file),
    family: 'Uji Sistem',
    subfamily: 'Regular',
    type: path.extname(file).slice(1).toUpperCase(),
    size: stat.size,
    source: 'system',
    registry: []
  });
  assert.match(entry.file, /\.(ttf|otf|ttc|otc)$/i, 'ekstensi cadangan: ' + entry.file);
  store.removeBackup(entry.id);
});

test('pelacakan tersimpan dan dapat dilepas', () => {
  const id = `unittest-${process.pid}`;
  store.setTracked(id, true, { family: 'Font Uji', fileName: 'uji.ttf' });
  assert.equal(store.trackedMap()[id].family, 'Font Uji');
  store.setTracked(id, false);
  assert.equal(store.trackedMap()[id], undefined);
});

test('kamus bahasa meliputi seluruh teks antarmuka', () => {
  const app = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  const keys = new Set();

  for (const match of app.matchAll(/\b(?:t|tp)\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1/g)) {
    keys.add(match[2].replace(/\\'/g, "'").replace(/\\"/g, '"'));
  }
  for (const match of html.matchAll(/data-i18n(?:-title|-placeholder|-aria-label)?="([^"]*)"/g)) {
    keys.add(match[1]);
  }

  assert.ok(keys.size > 50, 'kunci yang dipindai terlalu sedikit: ' + keys.size);
  for (const key of keys) {
    assert.ok(
      Object.prototype.hasOwnProperty.call(i18n.STRINGS, key),
      'kunci bahasa hilang: ' + JSON.stringify(key)
    );
  }
});

test('ganti bahasa mengubah teks dan pola dinamis', () => {
  i18n.setLanguage('id');
  assert.equal(i18n.t('Semua keluarga font'), 'Semua keluarga font');
  assert.equal(i18n.localeTag(), 'id-ID');

  i18n.setLanguage('en');
  assert.equal(i18n.t('Semua keluarga font'), 'All font families');
  assert.equal(i18n.localeTag(), 'en-US');
  assert.equal(i18n.tp('Tidak ada hasil untuk “{query}”', { query: 'arial' }), 'No results for “arial”');
  assert.equal(i18n.tp('{count} berkas', { count: 7 }), '7 files');

  i18n.setLanguage('id');
  assert.equal(i18n.tp('{count} berkas', { count: 7 }), '7 berkas');
});

console.log(`UNIT TEST OK (${passed} uji)`);
