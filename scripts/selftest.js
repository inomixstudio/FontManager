/* Uji unit tanpa dependensi untuk modul inti yang paling rawan regresi:
   parser sfnt dan penyimpanan cadangan/pelacakan. Dijalankan oleh `npm test`
   sebelum uji end-to-end. */
'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');

const { parseFontBuffer } = require('../lib/fontParser');
const store = require('../lib/store');

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

test('pelacakan tersimpan dan dapat dilepas', () => {
  const id = `unittest-${process.pid}`;
  store.setTracked(id, true, { family: 'Font Uji', fileName: 'uji.ttf' });
  assert.equal(store.trackedMap()[id].family, 'Font Uji');
  store.setTracked(id, false);
  assert.equal(store.trackedMap()[id], undefined);
});

console.log(`UNIT TEST OK (${passed} uji)`);
