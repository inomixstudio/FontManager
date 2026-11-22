'use strict';

/**
 * Dukungan font Adobe Fonts (langganan Creative Cloud).
 *
 * Creative Cloud menyinkronkan font langganan ke
 *   %APPDATA%\Adobe\CoreSync\plugins\livetype\
 * sebagai berkas tanpa ekstensi bernama angka (id sinkronisasi). Salinan
 * utuh ada di subfolder `t` dan `w`; subfolder `e` berisi bungkus
 * entitlement yang bukan font utuh. Metadata (nama keluarga, tautan
 * fonts.adobe.com, status aktif) ada di c\entitlements.xml.
 *
 * Berkas ini hanya membaca data Adobe untuk pratinjau/pelacakan/cadangan.
 * Penghapusan font Adobe diikuti pencabutan entri entitlement agar
 * Creative Cloud tidak mengunduhnya kembali secara otomatis.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const { parseFontFile } = require('./fontParser');

const SOURCE = 'adobe';
const SOURCE_LABEL = 'Adobe Fonts';

function livetypeDir() {
  const appdata = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  return path.join(appdata, 'Adobe', 'CoreSync', 'plugins', 'livetype');
}

function entitlementsPath() {
  return path.join(livetypeDir(), 'c', 'entitlements.xml');
}

function makeId(filePath) {
  return crypto
    .createHash('sha1')
    .update(path.resolve(filePath).toLowerCase())
    .digest('hex')
    .slice(0, 16);
}

/**
 * ID font Adobe diturunkan dari id sinkronisasi (nama berkas angka), bukan
 * dari path. Creative Cloud memindahkan berkas antar subfolder (t/w/e) saat
 * menyinkronkan ulang; ID berbasis path akan berubah dan membuat font
 * "hilang" dari daftar yang dilacak.
 */
function stableId(adobeId) {
  return 'adobe-' + String(adobeId);
}

function safeStat(filePath) {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ entitlements */

/**
 * Baca entitlements.xml Adobe → Map<id, {url, installState, expiredAt}>.
 * XML kecil dan sederhana; pembacaan regex cukup dan tidak butuh dependensi.
 */
function readEntitlements() {
  const map = new Map();
  let xml;
  try {
    xml = fs.readFileSync(entitlementsPath(), 'utf8');
  } catch {
    return map;
  }
  for (const match of xml.matchAll(/<font>([\s\S]*?)<\/font>/g)) {
    const block = match[1];
    const grab = (tag) => {
      const found = block.match(new RegExp('<' + tag + '>([\\s\\S]*?)<\\/' + tag + '>'));
      return found ? found[1].trim() : '';
    };
    const id = grab('id');
    if (!id) continue;
    map.set(id, {
      id,
      url: grab('familyURL'),
      installState: grab('installState'),
      expiredAt: grab('expiredAt'),
      block: match[0]
    });
  }
  return map;
}

/** Ambil blok XML asli untuk satu id (untuk disimpan dalam cadangan). */
function captureEntitlementBlock(id) {
  const entry = readEntitlements().get(String(id));
  return entry ? entry.block : '';
}

/**
 * Cabut entri entitlement satu font dari entitlements.xml agar Creative
 * Cloud tidak mengaktifkan ulang/mengunduh ulang font setelah dihapus.
 * @returns {{removed: boolean, error: string|null}}
 */
function removeEntitlement(id) {
  const file = entitlementsPath();
  let xml;
  try {
    xml = fs.readFileSync(file, 'utf8');
  } catch {
    return { removed: false, error: null }; // berkas tidak ada — tidak ada yang perlu dicabut
  }
  const needle = '<id>' + String(id) + '</id>';
  const at = xml.indexOf(needle);
  if (at < 0) return { removed: false, error: null };

  const start = xml.lastIndexOf('<font>', at);
  const end = xml.indexOf('</font>', at);
  if (start < 0 || end < 0) return { removed: false, error: 'Struktur entitlements.xml tidak dikenali.' };

  let cut = xml.slice(0, start);
  // Buang spasi/indentasi di awal blok agar tidak menyisakan baris kosong.
  cut = cut.replace(/[ \t]*\r?\n$/, '');
  const next = xml.slice(end + '</font>'.length);
  const updated = cut + next;

  try {
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, updated, 'utf8');
    fs.renameSync(tmp, file);
  } catch (error) {
    return { removed: false, error: 'Gagal memperbarui entitlements.xml: ' + error.message };
  }
  return { removed: true, error: null };
}

/**
 * Kembalikan blok entri entitlement saat memulihkan cadangan font Adobe.
 * @returns {{restored: boolean, error: string|null}}
 */
function reinsertEntitlement(block) {
  if (!block || !block.includes('<font>')) return { restored: false, error: null };
  const file = entitlementsPath();
  let xml;
  try {
    xml = fs.readFileSync(file, 'utf8');
  } catch {
    return { restored: false, error: null }; // tanpa entitlements.xml, biarkan Adobe membuat sendiri
  }
  const idMatch = block.match(/<id>([\s\S]*?)<\/id>/);
  if (idMatch && xml.includes('<id>' + idMatch[1] + '</id>')) {
    return { restored: true, error: null }; // entri sudah ada
  }
  const close = xml.lastIndexOf('</fonts>');
  if (close < 0) return { restored: false, error: 'Struktur entitlements.xml tidak dikenali.' };
  const indent = '\n    ';
  const updated = xml.slice(0, close) + indent + block.replace(/\s+$/, '') + '\n  ' + xml.slice(close);
  try {
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, updated, 'utf8');
    fs.renameSync(tmp, file);
  } catch (error) {
    return { restored: false, error: 'Gagal memperbarui entitlements.xml: ' + error.message };
  }
  return { restored: true, error: null };
}

/* ------------------------------------------------------------------ pemindaian */

const SCAN_DIRS = ['t', 'w', 'x', 'u', 'r', 'e'];
const VALID_EXT_LABEL = { OTTO: 'OTF', ttcf: 'TTC', true: 'TTF' };

function magicLabel(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(4);
    try {
      fs.readSync(fd, buf, 0, 4, 0);
    } finally {
      fs.closeSync(fd);
    }
    const magic = buf.toString('latin1', 0, 4);
    if (magic === 'OTTO') return 'OTF';
    if (magic === 'ttcf') return 'TTC';
    if (magic === 'true' || magic === 'typ1') return 'TTF';
    if (buf[0] === 0x00 && buf[1] === 0x01) return 'TTF';
    return null;
  } catch {
    return null;
  }
}

/**
 * Kumpulkan font Adobe yang aktif dilanggan.
 * @returns {Array<object>} objek font dengan bentuk sama seperti scanner.buildFont
 */
function collectAdobeFonts() {
  const root = livetypeDir();
  const entitlements = readEntitlements();
  const fonts = [];

  for (const dir of SCAN_DIRS) {
    const full = path.join(root, dir);
    let names;
    try {
      names = fs.readdirSync(full);
    } catch {
      continue;
    }
    for (const name of names) {
      if (!/^\d+$/.test(name)) continue;
      const filePath = path.join(full, name);
      const stat = safeStat(filePath);
      if (!stat || !stat.isFile()) continue;

      let meta = null;
      try {
        meta = parseFontFile(filePath);
      } catch {
        meta = null;
      }
      // Salinan bungkus entitlement (subfolder e) bukan font utuh — abaikan.
      if (!meta || !meta.parserOk || !meta.family || meta.familyFromFileName) continue;

      const info = entitlements.get(name) || {};
      const fullName = meta.fullName || [meta.family, meta.subfamily].filter(Boolean).join(' ');
      const type = magicLabel(filePath) || 'OTF';

      fonts.push({
        id: stableId(name),
        adobeId: name,
        adobeUrl: info.url || '',
        adobeState: info.installState || '',
        fileName: fullName.replace(/[<>:"/\\|?*\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim() + '.' + type.toLowerCase(),
        filePath,
        dir: full,
        family: meta.family,
        subfamily: meta.subfamily || '',
        fullName,
        psName: meta.psName || '',
        faces: meta.faces || [],
        families: meta.families || [meta.family],
        format: meta.format || type,
        type,
        weightClass: meta.weightClass || 400,
        weightName: meta.weightName || 'Regular',
        embedding: meta.embedding || 'Tidak diketahui',
        fsType: meta.fsType || 0,
        isVariable: !!meta.isVariable,
        isCollection: !!meta.isCollection,
        familyFromFileName: false,
        collectionCount: meta.collectionCount || 0,
        isItalic: !!meta.isItalic,
        parserOk: true,
        size: stat.size,
        mtime: stat.mtimeMs,
        modifiedAt: new Date(stat.mtimeMs).toISOString(),
        exists: true,
        previewable: true,
        source: SOURCE,
        sourceLabel: SOURCE_LABEL,
        protected: false,
        registered: false,
        registry: [],
        tracked: false,
        orphan: false
      });
    }
  }

  // Berkas yang sama bisa muncul di lebih dari satu subfolder; sisakan satu.
  const seen = new Map();
  for (const font of fonts) {
    const key = font.adobeId;
    const prev = seen.get(key);
    if (!prev) seen.set(key, font);
  }
  return Array.from(seen.values());
}

module.exports = {
  SOURCE,
  SOURCE_LABEL,
  livetypeDir,
  entitlementsPath,
  stableId,
  makeId,
  readEntitlements,
  captureEntitlementBlock,
  removeEntitlement,
  reinsertEntitlement,
  collectAdobeFonts
};
