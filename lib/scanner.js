'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const { parseFontFile, titleFromFileName } = require('./fontParser');
const adobe = require('./adobeFonts');
const registry = require('./registry');

const FONT_EXTS = new Set(['.ttf', '.otf', '.ttc', '.otc', '.fon', '.fnt', '.pfb', '.pfm']);
const PREVIEWABLE_EXTS = new Set(['.ttf', '.otf', '.ttc', '.otc']);

const PROTECTED_FILES = new Set([
  'segoeui.ttf',
  'segoeuib.ttf',
  'segoeuii.ttf',
  'segoeuiz.ttf',
  'segoeuil.ttf',
  'segoeuisl.ttf',
  'segoeuili.ttf',
  'segoeuibl.ttf',
  'seguibl.ttf',
  'seguibli.ttf',
  'seguisb.ttf',
  'seguisbi.ttf',
  'seguisli.ttf',
  'seguiemj.ttf',
  'seguisym.ttf',
  'segmdl2.ttf',
  'seguiptn.ttf',
  'marlett.ttf',
  'symbol.ttf',
  'micross.ttf',
  'tahoma.ttf',
  'tahomabd.ttf',
  'segoepr.ttf',
  'segoesc.ttf'
]);

const PROTECTED_FAMILIES = new Set([
  'segoe ui',
  'segoe ui variable',
  'segoe ui emoji',
  'segoe ui symbol',
  'segoe mdl2 assets',
  'marlett',
  'symbol',
  'microsoft sans serif'
]);

const SERVER_LABELS = {
  system: 'Sistem',
  user: 'Pengguna',
  custom: 'Kustom'
};

const cache = { at: 0, data: null };
const parseCache = new Map();
let scanVersion = 1;

function systemFontsDir() {
  return path.join(process.env.SystemRoot || 'C:\\Windows', 'Fonts');
}

function userFontsDir() {
  const localAppData =
    process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  return path.join(localAppData, 'Microsoft', 'Windows', 'Fonts');
}

function normalizeLower(value) {
  return path.resolve(value).toLowerCase();
}

function isInside(child, parent) {
  if (!child || !parent) return false;
  const c = normalizeLower(child);
  const p = normalizeLower(parent);
  return c === p || c.startsWith(p.endsWith(path.sep) ? p : p + path.sep);
}

function resolveRegistryPath(entry) {
  let value = String(entry.value || '').trim();
  value = value.replace(/^"(.*)"$/, '$1');
  value = value.replace(/%([^%]+)%/g, (match, name) => process.env[name] || match);

  if (/^[a-zA-Z]:[\\/]/.test(value) || value.startsWith('\\\\')) {
    return path.normalize(value);
  }
  const base = entry.root === 'HKCU' ? userFontsDir() : systemFontsDir();
  return path.normalize(path.join(base, value));
}

function makeId(filePath) {
  return crypto
    .createHash('sha1')
    .update(normalizeLower(filePath))
    .digest('hex')
    .slice(0, 16);
}

function safeStat(filePath) {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

function readFontMeta(filePath, stat) {
  const key = `${normalizeLower(filePath)}|${stat.size}|${Math.floor(stat.mtimeMs)}`;
  const cached = parseCache.get(key);
  if (cached) return cached;
  let parsed = null;
  try {
    parsed = parseFontFile(filePath);
  } catch {
    parsed = null;
  }
  if (!parsed) return null;
  if (parseCache.size > 40000) {
    let removed = 0;
    for (const oldKey of parseCache.keys()) {
      parseCache.delete(oldKey);
      if (++removed >= 10000) break;
    }
  }
  parseCache.set(key, parsed);
  return parsed;
}

function sourceFor(filePath, entry) {
  if (entry && entry.registry.some((item) => item.root === 'HKCU')) return 'user';
  if (isInside(filePath, userFontsDir())) return 'user';
  if (isInside(filePath, systemFontsDir())) return 'system';
  return 'custom';
}

function buildFont(entry) {
  const filePath = entry.path;
  const stat = safeStat(filePath);
  const exists = !!stat && stat.isFile();
  const ext = path.extname(filePath).toLowerCase();
  const previewable = exists && PREVIEWABLE_EXTS.has(ext);

  let meta = null;
  if (previewable) meta = readFontMeta(filePath, stat);

  const fileName = path.basename(filePath);
  const family =
    (meta && meta.family) ||
    entry.registryDisplayName ||
    titleFromFileName(fileName);
  const subfamily = (meta && meta.subfamily) || '';
  const source = sourceFor(filePath, entry);
  const isProtected =
    PROTECTED_FILES.has(fileName.toLowerCase()) ||
    PROTECTED_FAMILIES.has(String(family).toLowerCase());

  const typeLabel = (ext.replace('.', '') || 'font').toUpperCase();

  return {
    id: makeId(filePath),
    fileName,
    filePath,
    dir: path.dirname(filePath),
    family,
    subfamily,
    fullName: (meta && meta.fullName) || [family, subfamily].filter(Boolean).join(' '),
    psName: (meta && meta.psName) || '',
    faces: (meta && meta.faces) || [],
    families: (meta && meta.families) || [family],
    format: (meta && meta.format) || typeLabel,
    type: typeLabel,
    weightClass: (meta && meta.weightClass) || 400,
    weightName: (meta && meta.weightName) || 'Regular',
    embedding: (meta && meta.embedding) || 'Tidak diketahui',
    fsType: meta ? meta.fsType : 0,
    isVariable: !!(meta && meta.isVariable),
    isCollection: !!(meta && meta.isCollection),
    familyFromFileName: !!(meta && meta.familyFromFileName),
    collectionCount: (meta && meta.collectionCount) || 0,
    isItalic: !!(meta && meta.isItalic),
    parserOk: !!(meta && meta.parserOk),
    size: exists ? stat.size : 0,
    mtime: exists ? stat.mtimeMs : 0,
    modifiedAt: exists ? new Date(stat.mtimeMs).toISOString() : null,
    exists,
    previewable,
    source,
    sourceLabel: SERVER_LABELS[source] || source,
    protected: isProtected,
    registered: entry.registry.length > 0,
    registry: entry.registry.map((item) => ({
      root: item.root,
      key: item.key,
      name: item.name,
      value: item.value
    })),
    tracked: false,
    orphan: exists && entry.registry.length === 0
  };
}

function collectFileEntries(dir, map) {
  let names;
  try {
    names = fs.readdirSync(dir);
  } catch {
    return;
  }
  for (const name of names) {
    const full = path.join(dir, name);
    const ext = path.extname(name).toLowerCase();
    if (!FONT_EXTS.has(ext)) continue;
    const key = normalizeLower(full);
    if (map.has(key)) continue;
    const stat = safeStat(full);
    if (!stat || !stat.isFile()) continue;
    map.set(key, { path: path.normalize(full), registry: [] });
  }
}

function computeStats(fonts) {
  const stats = {
    total: 0,
    system: 0,
    user: 0,
    custom: 0,
    adobe: 0,
    missing: 0,
    orphan: 0,
    previewable: 0,
    protected: 0,
    variable: 0,
    collections: 0,
    totalSize: 0,
    systemSize: 0,
    userSize: 0
  };
  for (const font of fonts) {
    stats.total++;
    if (font.source in stats) stats[font.source]++;
    if (!font.exists) stats.missing++;
    if (font.orphan) stats.orphan++;
    if (font.previewable) stats.previewable++;
    if (font.protected) stats.protected++;
    if (font.isVariable) stats.variable++;
    if (font.isCollection) stats.collections++;
    stats.totalSize += font.size;
    if (font.source === 'system') stats.systemSize += font.size;
    if (font.source === 'user') stats.userSize += font.size;
    if (font.source === 'adobe') stats.adobeSize = (stats.adobeSize || 0) + font.size;
  }
  return stats;
}

/**
 * Memindai seluruh font yang terinstal (registri + folder font).
 * @param {{force?: boolean}} options
 */
async function scanFonts(options = {}) {
  const force = !!options.force;
  if (!force && cache.data && Date.now() - cache.at < 60000) {
    return cache.data;
  }

  const startedAt = Date.now();
  const warnings = [];
  const map = new Map();

  // Pindai folder font lebih dulu, sambil registri dibaca paralel.
  collectFileEntries(systemFontsDir(), map);
  collectFileEntries(userFontsDir(), map);

  let registryResult = { entries: [], error: null };
  try {
    registryResult = await registry.readRegistryFonts();
  } catch (error) {
    warnings.push('Registri tidak dapat dibaca: ' + error.message);
  }
  if (registryResult.error) warnings.push(registryResult.error);

  for (const entry of registryResult.entries) {
    let resolved;
    try {
      resolved = resolveRegistryPath(entry);
    } catch {
      continue;
    }
    if (!resolved) continue;
    const key = normalizeLower(resolved);
    let record = map.get(key);
    if (!record) {
      record = {
        path: resolved,
        registry: [],
        registryDisplayName: ''
      };
      map.set(key, record);
    }
    record.registry.push(entry);
    if (!record.registryDisplayName) {
      record.registryDisplayName = entry.name
        .replace(/\s*\((TrueType|OpenType|PostScript|All res)\)\s*$/i, '')
        .trim();
    }
  }

  // Folder font kustom yang terdaftar di registri sudah tercakup lewat map,
  // tetapi berkas lain di folder tersebut juga ikut dipindai.
  const extraDirs = new Set();
  for (const record of map.values()) {
    if (record.registry.length === 0) continue;
    const dir = path.dirname(record.path);
    if (!isInside(dir, systemFontsDir()) && !isInside(dir, userFontsDir())) {
      extraDirs.add(dir);
    }
  }
  for (const dir of extraDirs) collectFileEntries(dir, map);

  const fonts = [];
  for (const record of map.values()) {
    try {
      fonts.push(buildFont(record));
    } catch (error) {
      warnings.push(`Gagal membaca ${path.basename(record.path)}: ${error.message}`);
    }
  }

  // Font langganan Adobe Fonts (Creative Cloud) tidak terdaftar di registri
  // Windows; kumpulkan langsung dari folder sinkronisasi CoreSync.
  try {
    for (const font of adobe.collectAdobeFonts()) {
      const stat = safeStat(font.filePath);
      font.exists = !!stat && stat.isFile();
      font.size = font.exists ? stat.size : 0;
      if (font.exists) {
        font.mtime = stat.mtimeMs;
        font.modifiedAt = new Date(stat.mtimeMs).toISOString();
      }
      fonts.push(font);
    }
  } catch (error) {
    warnings.push('Font Adobe tidak dapat dibaca: ' + error.message);
  }

  fonts.sort((a, b) => {
    const byFamily = a.family.localeCompare(b.family, 'id', { sensitivity: 'base' });
    if (byFamily !== 0) return byFamily;
    return String(a.subfamily).localeCompare(String(b.subfamily), 'id', { sensitivity: 'base' });
  });

  const stats = computeStats(fonts);
  const data = {
    fonts,
    stats,
    scannedAt: new Date().toISOString(),
    scanDurationMs: Date.now() - startedAt,
    warnings,
    dirs: {
      system: systemFontsDir(),
      user: userFontsDir(),
      adobe: adobe.livetypeDir()
    },
    platform: process.platform
  };

  cache.data = data;
  cache.at = Date.now();
  scanVersion++;
  return data;
}

function invalidateScan() {
  cache.at = 0;
  cache.data = null;
  scanVersion++;
}

function currentScanVersion() {
  return scanVersion;
}

/** Daftar font dari hasil pindai terakhir (atau array kosong). */
function currentFonts() {
  return (cache.data && cache.data.fonts) || [];
}

function findFontSync(id) {
  if (!cache.data) return null;
  return cache.data.fonts.find((font) => font.id === id) || null;
}

async function getFontById(id, options = {}) {
  let font = findFontSync(id);
  if (!font) {
    await scanFonts(options);
    font = findFontSync(id);
  }
  return font;
}

function fontsInDir(dir) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

module.exports = {
  FONT_EXTS,
  PREVIEWABLE_EXTS,
  PROTECTED_FILES,
  systemFontsDir,
  userFontsDir,
  isInside,
  normalizeLower,
  makeId,
  scanFonts,
  invalidateScan,
  getFontById,
  findFontSync,
  fontsInDir,
  computeStats,
  currentScanVersion,
  currentFonts
};
