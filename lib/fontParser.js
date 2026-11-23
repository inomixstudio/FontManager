'use strict';

/**
 * Parser ringan untuk berkas sfnt (TTF / OTF / TTC / OTC).
 * Hanya membaca tabel `name`, `OS/2`, `head`, dan mendeteksi `fvar`.
 * Pembacaan dilakukan per potongan (bukan seluruh berkas) agar pemindaian
 * ribuan font tetap cepat dan hemat memori.
 */

const fs = require('fs');
const path = require('path');

const WEIGHT_LABELS = [
  [100, 'Thin'],
  [200, 'ExtraLight'],
  [300, 'Light'],
  [400, 'Regular'],
  [500, 'Medium'],
  [600, 'SemiBold'],
  [700, 'Bold'],
  [800, 'ExtraBold'],
  [900, 'Black']
];

const MAX_NAME_TABLE = 1024 * 1024;
const MAX_FACES = 64;
const MAX_TABLES = 256;

function weightLabel(weight) {
  const w = Number(weight) || 400;
  let best = WEIGHT_LABELS[0];
  for (const entry of WEIGHT_LABELS) {
    if (Math.abs(entry[0] - w) < Math.abs(best[0] - w)) best = entry;
  }
  return best[1];
}

function embeddingLabel(fsType) {
  if (fsType == null) return 'Tidak diketahui';
  const low = fsType & 0x0f;
  if (low === 0x00) return 'Bebas disematkan';
  if (low === 0x02) return 'Terbatas — tidak boleh disematkan';
  if (low === 0x04) return 'Hanya pratinjau & cetak';
  if (low === 0x08) return 'Dapat diedit';
  if (low & 0x02) return 'Terbatas';
  return 'Kustom';
}

function u16(buf, offset) {
  return offset >= 0 && offset + 2 <= buf.length ? buf.readUInt16BE(offset) : 0;
}

function u32(buf, offset) {
  return offset >= 0 && offset + 4 <= buf.length ? buf.readUInt32BE(offset) : 0;
}

function decodeUtf16BE(buf, start, byteLength) {
  const count = Math.floor(byteLength / 2);
  let out = '';
  for (let i = 0; i < count; i++) {
    const at = start + i * 2;
    if (at + 2 > buf.length) break;
    out += String.fromCharCode(buf.readUInt16BE(at));
  }
  return out;
}

function cleanString(value) {
  if (!value) return '';
  return String(value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ------------------------------------------------------------- pembaca IO */

function bufferReader(buf) {
  return {
    size: buf.length,
    read(offset, length) {
      const start = Math.max(0, Math.min(offset, buf.length));
      const end = Math.max(start, Math.min(offset + length, buf.length));
      return buf.subarray(start, end);
    }
  };
}

function fileReader(filePath) {
  const fd = fs.openSync(filePath, 'r');
  let size = 0;
  try {
    size = fs.fstatSync(fd).size;
  } catch {
    size = 0;
  }
  return {
    size,
    read(offset, length) {
      const start = Math.max(0, Math.min(offset, size));
      const end = Math.max(start, Math.min(offset + length, size));
      if (end <= start) return Buffer.alloc(0);
      const out = Buffer.allocUnsafe(end - start);
      let readBytes = 0;
      try {
        readBytes = fs.readSync(fd, out, 0, out.length, start);
      } catch {
        return Buffer.alloc(0);
      }
      return readBytes === out.length ? out : out.subarray(0, readBytes);
    },
    close() {
      try {
        fs.closeSync(fd);
      } catch {
        /* abaikan */
      }
    }
  };
}

/* ------------------------------------------------------------- tabel sfnt */

function readDirectory(reader, base) {
  const header = reader.read(base, 12);
  if (header.length < 12) return null;

  const count = Math.min(header.readUInt16BE(4), MAX_TABLES);
  const directory = reader.read(base + 12, count * 16);
  const tables = Object.create(null);

  for (let i = 0; i < count; i++) {
    const record = i * 16;
    if (record + 16 > directory.length) break;
    const tag = directory.toString('latin1', record, record + 4);
    const offset = directory.readUInt32BE(record + 8);
    const length = directory.readUInt32BE(record + 12);
    if (!offset || offset >= reader.size) continue;
    tables[tag] = {
      offset,
      length: Math.max(0, Math.min(length, reader.size - offset))
    };
  }
  return { version: header.readUInt32BE(0), tables };
}

function readNames(buf) {
  const names = Object.create(null);
  if (buf.length < 6) return names;

  const count = Math.min(buf.readUInt16BE(2), 4096);
  const storage = buf.readUInt16BE(4);

  for (let i = 0; i < count; i++) {
    const record = 6 + i * 12;
    if (record + 12 > buf.length) break;
    const platform = buf.readUInt16BE(record);
    const encoding = buf.readUInt16BE(record + 2);
    const language = buf.readUInt16BE(record + 4);
    const nameId = buf.readUInt16BE(record + 6);
    const length = buf.readUInt16BE(record + 8);
    const offset = buf.readUInt16BE(record + 10);
    if (!length) continue;

    const start = storage + offset;
    if (start < 0 || start + length > buf.length) continue;

    let value = '';
    if (platform === 3 || platform === 0) {
      value = decodeUtf16BE(buf, start, length);
    } else if (platform === 1 || platform === 2) {
      value = buf.toString('latin1', start, start + length);
    } else {
      continue;
    }
    value = cleanString(value);
    if (!value) continue;

    let score = 1;
    if (platform === 3) score += 10;
    if (encoding === 1 || encoding === 10) score += 2;
    if (language === 0x0409) score += 6;
    else if (language === 0) score += 3;

    const previous = names[nameId];
    if (!previous || score > previous.score) names[nameId] = { value, score };
  }
  return names;
}

function pickName(names, ids) {
  for (const id of ids) {
    const entry = names[id];
    if (entry && entry.value) return entry.value;
  }
  return '';
}

function readFace(reader, base) {
  const directory = readDirectory(reader, base);
  if (!directory) return null;

  const nameTable = directory.tables.name;
  const names = nameTable
    ? readNames(reader.read(nameTable.offset, Math.min(nameTable.length, MAX_NAME_TABLE)))
    : Object.create(null);

  let family = pickName(names, [16, 1]);
  const subfamily = pickName(names, [17, 2]);
  const fullName = pickName(names, [4]) || [family, subfamily].filter(Boolean).join(' ');
  const psName = pickName(names, [6]) || '';
  if (!family && subfamily) family = subfamily;

  let weightClass = 400;
  let widthClass = 5;
  let fsType = 0;
  const os2 = directory.tables['OS/2'];
  if (os2) {
    const value = reader.read(os2.offset, Math.min(os2.length, 96));
    if (value.length >= 10) {
      weightClass = value.readUInt16BE(4) || 400;
      widthClass = value.readUInt16BE(6) || 5;
      fsType = value.readUInt16BE(8) || 0;
    }
  }

  let unitsPerEm = 1000;
  let macStyle = 0;
  const head = directory.tables.head;
  if (head) {
    const value = reader.read(head.offset, Math.min(head.length, 54));
    if (value.length >= 46) {
      unitsPerEm = value.readUInt16BE(18) || 1000;
      macStyle = value.readUInt16BE(44) || 0;
    }
  }

  const variable = !!directory.tables.fvar;
  const italic = !!(macStyle & 0x02) || /italic|oblique/i.test(subfamily);
  const bold = !!(macStyle & 0x01) || weightClass >= 600;

  return {
    family,
    subfamily,
    fullName,
    psName,
    weightClass,
    widthClass,
    fsType,
    unitsPerEm,
    italic,
    bold,
    variable,
    cff: directory.version === 0x4f54544f
  };
}

function titleFromFileName(filePath) {
  const base = path.basename(filePath || '', path.extname(filePath || ''));
  const pretty = base.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return pretty || base || 'Font tanpa nama';
}

function formatLabelFor(signature, faces) {
  if (signature === 'ttcf') {
    return faces.some((face) => face && face.cff) ? 'Koleksi OpenType' : 'Koleksi TrueType';
  }
  if (signature === 'OTTO') return 'OpenType (CFF)';
  if (signature === 'wOFF') return 'WOFF';
  if (signature === 'wOF2') return 'WOFF2';
  if (signature === 'true' || signature === 'typ1' || signature === 'ttf') return 'TrueType';
  return 'Tidak dikenali';
}

/**
 * Normalisasi tanda tangan berkas sfnt. Dipakai untuk membedakan font asli dari
 * berkas sampah berekstensi .ttf/.otf: pemasangan hanya boleh dilanjutkan
 * bila tanda tangannya dikenali.
 */
function signatureOf(header) {
  const magic = header.length >= 4 ? header.toString('latin1', 0, 4) : '';
  if (magic === 'ttcf') return 'ttcf';
  if (magic === 'OTTO') return 'OTTO';
  if (magic === 'true' || magic === 'typ1') return 'true';
  if (magic === 'wOFF') return 'wOFF';
  if (magic === 'wOF2') return 'wOF2';
  if (
    header.length >= 4 &&
    header[0] === 0x00 &&
    header[1] === 0x01 &&
    header[2] === 0x00 &&
    header[3] === 0x00
  ) {
    return 'ttf';
  }
  return 'unknown';
}

function parseWithReader(reader, filePath) {
  const header = reader.read(0, 12);
  const signature = signatureOf(header);
  const magic = header.length >= 4 ? header.toString('latin1', 0, 4) : '';
  const faces = [];
  let isCollection = false;

  try {
    if (magic === 'ttcf' && header.length >= 12) {
      isCollection = true;
      const numFonts = Math.min(header.readUInt32BE(8) || 1, MAX_FACES);
      const offsets = reader.read(12, numFonts * 4);
      for (let i = 0; i < numFonts; i++) {
        if ((i + 1) * 4 > offsets.length) break;
        const offset = offsets.readUInt32BE(i * 4);
        if (!offset || offset >= reader.size) continue;
        try {
          const face = readFace(reader, offset);
          if (face && (face.family || face.fullName)) faces.push(face);
        } catch {
          /* abaikan wajah yang rusak */
        }
      }
    } else if (header.length >= 12) {
      try {
        const face = readFace(reader, 0);
        if (face && (face.family || face.fullName)) faces.push(face);
      } catch {
        /* berkas rusak — gunakan fallback */
      }
    }
  } catch {
    /* berkas tidak dikenali — gunakan fallback nama berkas */
  }

  const first = faces[0] || null;
  const families = [];
  for (const face of faces) {
    if (face.family && !families.includes(face.family)) families.push(face.family);
  }

  const fallbackName = titleFromFileName(filePath);
  let family = (first && first.family) || fallbackName;
  let familyFromFileName = !first || !first.family;
  let subfamily = (first && first.subfamily) || '';
  let fullName = (first && first.fullName) || [family, subfamily].filter(Boolean).join(' ');

  // Sebagian font memakai nama keluarga berupa tanda baca saja (".").
  // Ganti dengan nama berkas agar daftar tetap terbaca.
  if (family.length < 2 || /^[.\-_·•\s]+$/.test(family)) {
    family = fallbackName;
    familyFromFileName = true;
    if (subfamily && subfamily.toLowerCase() === family.toLowerCase()) subfamily = '';
    fullName = [family, subfamily].filter(Boolean).join(' ');
  }

  return {
    family,
    subfamily,
    fullName,
    psName: (first && first.psName) || '',
    weightClass: (first && first.weightClass) || 400,
    weightName: weightLabel(first ? first.weightClass : 400),
    widthClass: (first && first.widthClass) || 5,
    fsType: first ? first.fsType : 0,
    embedding: embeddingLabel(first ? first.fsType : 0),
    unitsPerEm: (first && first.unitsPerEm) || 1000,
    isVariable: faces.some((face) => face.variable),
    isItalic: !!(first && first.italic),
    isBold: !!(first && first.bold),
    isCollection,
    collectionCount: isCollection ? faces.length : 0,
    families,
    faces: faces.map((face) => ({
      family: face.family || family,
      subfamily: face.subfamily || '',
      fullName: face.fullName || '',
      psName: face.psName || '',
      weightClass: face.weightClass || 400,
      weightName: weightLabel(face.weightClass),
      italic: !!face.italic,
      variable: !!face.variable
    })),
    format: formatLabelFor(signature, faces),
    signature,
    parserOk: faces.length > 0 && !!first && !!first.family,
    familyFromFileName,
    fallbackName: !first
  };
}

function parseFontBuffer(buf, filePath) {
  return parseWithReader(bufferReader(buf), filePath);
}

function parseFontFile(filePath) {
  const reader = fileReader(filePath);
  try {
    return parseWithReader(reader, filePath);
  } finally {
    if (typeof reader.close === 'function') reader.close();
  }
}

module.exports = {
  parseFontBuffer,
  parseFontFile,
  weightLabel,
  embeddingLabel,
  titleFromFileName
};
