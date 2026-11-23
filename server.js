'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { exec } = require('child_process');

const scanner = require('./lib/scanner');
const store = require('./lib/store');
const manage = require('./lib/manage');
const adobe = require('./lib/adobeFonts');

const HOST = '127.0.0.1';
const START_PORT = Number(process.env.PORT || 4317);
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_INSTALL_BYTES = 128 * 1024 * 1024;
const MAX_JSON_BYTES = 1024 * 1024;
const MAX_BATCH_DELETE = 2000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.ttc': 'font/collection',
  '.txt': 'text/plain; charset=utf-8'
};

const FONT_MIME = {
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.ttc': 'font/collection',
  '.otc': 'font/collection',
  '.fon': 'application/octet-stream',
  '.fnt': 'application/octet-stream',
  '.pfb': 'application/octet-stream',
  '.pfm': 'application/octet-stream'
};

let activePort = START_PORT;

function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function sendJson(res, status, payload) {
  let body = Buffer.from(JSON.stringify(payload), 'utf8');
  const req = res.req;
  const acceptsGzip = req && /\bgzip\b/i.test(String(req.headers['accept-encoding'] || ''));

  if (acceptsGzip && body.length > 4096) {
    try {
      body = zlib.gzipSync(body, { level: 6 });
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': body.length,
        'Content-Encoding': 'gzip',
        Vary: 'Accept-Encoding',
        'Cache-Control': 'no-store',
        ...SECURITY_HEADERS
      });
      res.end(body);
      return;
    } catch {
      /* fallback tanpa kompresi */
    }
  }

  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    ...SECURITY_HEADERS
  });
  res.end(body);
}

function summarizeFont(font) {
  return {
    id: font.id,
    fileName: font.fileName,
    filePath: font.filePath,
    family: font.family,
    subfamily: font.subfamily,
    fullName: font.fullName,
    type: font.type,
    format: font.format,
    source: font.source,
    sourceLabel: font.sourceLabel,
    size: font.size,
    modifiedAt: font.modifiedAt,
    weightClass: font.weightClass,
    weightName: font.weightName,
    isVariable: font.isVariable,
    isCollection: font.isCollection,
    familyFromFileName: font.familyFromFileName,
    isItalic: font.isItalic,
    previewable: font.previewable,
    exists: font.exists,
    protected: font.protected,
    registered: font.registered,
    orphan: font.orphan,
    parserOk: font.parserOk,
    adobeUrl: font.adobeUrl || '',
    adobeState: font.adobeState || '',
    tracked: !!font.tracked
  };
}

/*
 * Header keamanan untuk semua respons. CSP dibuat minimal karena UI memakai
 * banyak atribut `style` inline dan memuat berkas font dari endpoint lokal.
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy':
    "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'"
};

function sendText(res, status, text) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(text),
    'Cache-Control': 'no-store',
    ...SECURITY_HEADERS
  });
  res.end(text);
}

/*
 * Mengalirkan berkas dengan penanganan kesalahan. Tanpa listener 'error',
 * berkas yang hilang/diganti di tengah-tengah (mis. font yang baru dihapus
 * pengguna atau Creative Cloud) memicu unhandled error dan menjatuhkan proses.
 */
function streamFile(req, res, filePath, headers) {
  let stream;
  try {
    stream = fs.createReadStream(filePath);
  } catch (error) {
    sendText(res, 404, 'Berkas tidak dapat dibaca.');
    return;
  }
  stream.on('error', () => {
    if (!res.headersSent) {
      sendText(res, 404, 'Berkas tidak dapat dibaca.');
      return;
    }
    try {
      res.destroy();
    } catch {
      /* abaikan */
    }
  });
  res.writeHead(200, headers);
  stream.pipe(res);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > limit) {
        reject(fail(413, 'Ukuran permintaan terlalu besar.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (error) => reject(fail(400, 'Gagal membaca permintaan: ' + error.message)));
  });
}

async function readJsonBody(req) {
  const raw = await readBody(req, MAX_JSON_BYTES);
  if (!raw.length) return {};
  try {
    const parsed = JSON.parse(raw.toString('utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    throw fail(400, 'Body JSON tidak valid.');
  }
}

function assertRequest(req) {
  const host = String(req.headers.host || '').toLowerCase();
  if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)) {
    throw fail(403, 'Host permintaan tidak diizinkan.');
  }

  const origin = req.headers.origin;
  if (origin) {
    let allowed = false;
    try {
      const parsed = new URL(origin);
      allowed =
        (parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost') &&
        Number(parsed.port || 80) === activePort;
    } catch {
      allowed = false;
    }
    if (!allowed) throw fail(403, 'Asal permintaan tidak diizinkan.');
  }

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.headers['x-fm-request'] !== '1') {
    throw fail(403, 'Permintaan ditolak: header keamanan aplikasi tidak ditemukan.');
  }
}

function serveStatic(req, res, pathname) {
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(PUBLIC_DIR, relative);
  const relativeCheck = path.relative(PUBLIC_DIR, filePath);
  if (relativeCheck.startsWith('..') || path.isAbsolute(relativeCheck)) {
    sendText(res, 403, 'Akses ditolak.');
    return;
  }

  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    sendText(res, 404, 'Berkas tidak ditemukan.');
    return;
  }
  if (!stat.isFile()) {
    sendText(res, 404, 'Berkas tidak ditemukan.');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const etag = `W/"${stat.size}-${Math.floor(stat.mtimeMs)}"`;
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag });
    res.end();
    return;
  }

  streamFile(req, res, filePath, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache',
    ETag: etag,
    ...SECURITY_HEADERS
  });
}

function serveFontFile(req, res, font) {
  if (!font.exists) {
    sendJson(res, 404, { error: 'Berkas font tidak tersedia di disk.' });
    return;
  }

  let stat;
  try {
    stat = fs.statSync(font.filePath);
  } catch (error) {
    sendJson(res, 404, { error: 'Berkas font tidak dapat dibuka: ' + error.message });
    return;
  }

  const ext = path.extname(font.filePath).toLowerCase();
  const etag = `W/"${stat.size}-${Math.floor(stat.mtimeMs)}"`;
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag });
    res.end();
    return;
  }

  streamFile(req, res, font.filePath, {
    'Content-Type': FONT_MIME[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': 'private, max-age=300',
    ETag: etag,
    ...SECURITY_HEADERS
  });
}

/**
 * Metadata untuk entri lacak. Server lebih tahu daripada klien: ambil dari
 * cache pindai bila font dikenal, sehingga path/berkas tidak pernah kosong.
 */
function trackMetaFor(id, fallback = {}) {
  const font = scanner.findFontSync(id);
  const pick = (key) => {
    const fromFont = font && typeof font[key] === 'string' ? font[key] : '';
    if (fromFont) return fromFont;
    const value = fallback && fallback[key];
    return typeof value === 'string' ? value : '';
  };
  return {
    family: pick('family'),
    subfamily: pick('subfamily'),
    fileName: pick('fileName'),
    filePath: pick('filePath')
  };
}

async function fontsPayload(force) {
  const data = await scanner.scanFonts({ force });
  const tracked = migrateAdobeTracked(store.trackedMap());
  const fonts = data.fonts.map((font) => {
    font.tracked = !!tracked[font.id];
    return summarizeFont(font);
  });
  data.stats.tracked = Object.keys(tracked).length;
  data.stats.trackedInstalled = fonts.filter((font) => font.tracked).length;
  return {
    fonts,
    tracked,
    stats: data.stats,
    scannedAt: data.scannedAt,
    scanDurationMs: data.scanDurationMs,
    warnings: data.warnings,
    dirs: data.dirs,
    platform: data.platform
  };
}

/**
 * Entri lacak font Adobe versi lama memakai ID berbasis path (hash sha1).
 * Saat Creative Cloud memindahkan berkas ke subfolder lain, ID itu tidak
 * lagi cocok dan font hilang dari tab Dilacak. Pindahkan ke ID stabil
 * (adobe-<id sinkronisasi>) sekali saja.
 */
function migrateAdobeTracked(tracked) {
  if (!tracked || typeof tracked !== 'object') return tracked || {};
  let livetype = '';
  try {
    livetype = path.resolve(adobe.livetypeDir()).toLowerCase();
  } catch {
    return tracked;
  }

  let changed = false;
  const stableIds = new Set();
  for (const [id, meta] of Object.entries(tracked)) {
    if (String(id).startsWith('adobe-')) stableIds.add(id);
  }

  for (const [id, meta] of Object.entries(tracked)) {
    const raw = String((meta && meta.filePath) || '');
    let stable = '';
    if (raw) {
      let resolved;
      try {
        resolved = path.resolve(raw).toLowerCase();
      } catch {
        resolved = '';
      }
      if (resolved && resolved.startsWith(livetype)) {
        const base = path.basename(resolved);
        if (/^\d+$/.test(base)) stable = adobe.stableId(base);
      }
    }

    // Tanpa path (entri lacak lama), kenali lewat nama berkas/keluarga dari
    // hasil pindai: font Adobe adalah satu-satunya yang tidak terdaftar di
    // registri Windows namun cocok dengan entri lacak.
    if (!stable) {
      const candidates = findAdobeIdsFor(meta);
      if (candidates.length === 1) stable = candidates[0];
    }

    if (!stable || stable === id) continue;
    if (stableIds.has(stable)) {
      delete tracked[id];
      changed = true;
      continue;
    }
    delete tracked[id];
    tracked[stable] = { ...meta, id: stable };
    stableIds.add(stable);
    changed = true;
  }

  if (changed) {
    try {
      store.replaceTracked(tracked);
    } catch {
      /* abaikan: pelacakan tetap berfungsi untuk sesi ini */
    }
  }
  return tracked;
}

/** Cari id stabil Adobe yang cocok dengan metadata entri lacak. */
function findAdobeIdsFor(meta) {
  if (!meta) return [];
  const wantFile = String(meta.fileName || '').trim().toLowerCase();
  const wantFamily = String(meta.family || '').trim().toLowerCase();
  const wantStyle = String(meta.subfamily || '').trim().toLowerCase();
  const matches = [];

  const data = scanner.currentFonts ? scanner.currentFonts() : null;
  const fonts = data || [];
  for (const font of fonts) {
    if (font.source !== adobe.SOURCE) continue;
    if (wantFile && String(font.fileName).toLowerCase() !== wantFile) continue;
    if (wantFamily && String(font.family).toLowerCase() !== wantFamily) continue;
    if (wantStyle && String(font.subfamily).toLowerCase() !== wantStyle) continue;
    matches.push(font.id);
  }
  return matches;
}

/*
 * Daftar font berukuran besar (bisa melebihi 6 MB); kompresi gzip per
 * permintaan memakan CPU tanpa perlu. Cache hasil serialisasi + gzip per
 * generasi pindai (versi pindai + jumlah font dilacak berubah saat data
 * berubah), sehingga permintaan ulang cukup mengirim ulang buffer.
 */
const payloadCache = { key: '', json: '', gz: null };

function fontsCacheKey(payload) {
  return `${scanner.currentScanVersion()}:${payload.stats.tracked}:${payload.fonts.length}`;
}

function sendFontsPayload(res, status, payload) {
  const key = fontsCacheKey(payload);
  if (payloadCache.key !== key) {
    payloadCache.key = key;
    payloadCache.json = JSON.stringify(payload);
    payloadCache.gz = null;
  }

  const req = res.req;
  const acceptsGzip = req && /\bgzip\b/i.test(String(req.headers['accept-encoding'] || ''));

  if (acceptsGzip) {
    if (!payloadCache.gz) {
      try {
        payloadCache.gz = zlib.gzipSync(Buffer.from(payloadCache.json, 'utf8'), { level: 6 });
      } catch {
        payloadCache.gz = null;
      }
    }
    if (payloadCache.gz) {
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': payloadCache.gz.length,
        'Content-Encoding': 'gzip',
        Vary: 'Accept-Encoding',
        'Cache-Control': 'no-store',
        ...SECURITY_HEADERS
      });
      res.end(payloadCache.gz);
      return;
    }
  }

  const body = Buffer.from(payloadCache.json, 'utf8');
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    ...SECURITY_HEADERS
  });
  res.end(body);
}

async function handleApi(req, res, url, pathname) {
  assertRequest(req);

  const parts = pathname.split('/').filter(Boolean);
  const resource = parts[1];

  if (resource === 'status' && parts.length === 2) {
    if (req.method !== 'GET') throw fail(405, 'Metode tidak didukung.');
    sendJson(res, 200, {
      ok: true,
      platform: process.platform,
      port: activePort,
      dirs: { system: scanner.systemFontsDir(), user: scanner.userFontsDir(), adobe: adobe.livetypeDir() },
      dataDir: store.DATA_DIR
    });
    return;
  }

  if (resource === 'progress' && parts.length === 3) {
    if (req.method !== 'GET' && req.method !== 'HEAD') throw fail(405, 'Metode tidak didukung.');
    sendJson(res, 200, { ok: true, progress: manage.getProgress(parts[2]) });
    return;
  }

  if (resource === 'fonts') {
    if (parts.length === 2) {
      if (req.method !== 'GET') throw fail(405, 'Metode tidak didukung.');
      const force = url.searchParams.get('refresh') === '1';
      sendFontsPayload(res, 200, await fontsPayload(force));
      return;
    }

    if (parts.length === 3 && parts[2] === 'track-batch') {
      if (req.method !== 'POST') throw fail(405, 'Metode tidak didukung.');
      const body = await readJsonBody(req);
      const rawIds = Array.isArray(body.ids)
        ? [...new Set(body.ids.filter((id) => typeof id === 'string'))]
        : [];
      if (rawIds.length > 500) {
        throw fail(400, 'Terlalu banyak font dalam satu permintaan (maksimal 500).');
      }
      if (!rawIds.length) throw fail(400, 'Daftar font kosong.');

      // Klien mengirim metadata agar pelacakan per keluarga tidak perlu
      // memindai ulang seluruh folder font.
      const provided = new Map();
      for (const item of Array.isArray(body.items) ? body.items : []) {
        if (!item || typeof item.id !== 'string') continue;
        provided.set(item.id, item);
      }

      const items = rawIds.map((id) => {
        const meta = provided.get(id);
        return { id, meta: trackMetaFor(id, meta || {}) };
      });
      const result = store.setTrackedMany(items, !!body.tracked);
      sendJson(res, 200, { ok: true, tracked: result.tracked, count: items.length });
      return;
    }

    if (parts.length === 3 && parts[2] === 'delete-batch') {
      if (req.method !== 'POST') throw fail(405, 'Metode tidak didukung.');
      const body = await readJsonBody(req);
      const rawIds = Array.isArray(body.ids)
        ? [...new Set(body.ids.filter((id) => typeof id === 'string'))]
        : [];
      if (rawIds.length > MAX_BATCH_DELETE) {
        throw fail(400, `Terlalu banyak font dalam satu permintaan (maksimal ${MAX_BATCH_DELETE}).`);
      }
      if (!rawIds.length) throw fail(400, 'Daftar font kosong.');

      await scanner.scanFonts();
      const fonts = [];
      const unknownIds = [];
      for (const id of rawIds) {
        const font = scanner.findFontSync(id);
        if (font) fonts.push(font);
        else unknownIds.push(id);
      }

      // Entri lacak yang berkasnya tidak terdeteksi (synthetic) tidak ada di
      // cache pindai. Untuk itu "membersihkan" berarti menghentikan pelacakan.
      const tracked = store.trackedMap();
      const untrackIds = unknownIds.filter((id) => tracked[id]);
      if (!fonts.length && !untrackIds.length) {
        throw fail(404, 'Font tidak ditemukan. Pindai ulang daftar font.');
      }

      const result = fonts.length
        ? await manage.deleteFonts(fonts, {
            backup: body.backup !== false,
            progressId: body.progressId
          })
        : {
            ok: true,
            elevated: false,
            canceled: false,
            results: [],
            error: null,
            count: 0,
            fileCount: 0,
            backups: [],
            deleted: []
          };

      if (untrackIds.length) {
        try {
          store.setTrackedMany(
            untrackIds.map((id) => ({ id })),
            false
          );
        } catch {
          /* abaikan: pelacakan tetap berfungsi untuk sesi ini */
        }
        result.untracked = untrackIds;
        result.count = (result.count || 0) + untrackIds.length;
      }

      sendJson(res, result.ok ? 200 : 207, result);
      return;
    }

    const id = parts[2];
    const font = await scanner.getFontById(id);
    if (!font) {
      // Font yang dilacak tetapi berkasnya tidak terdeteksi: menghapusnya
      // berarti menghentikan pelacakan, bukan membersihkan berkas/registri.
      if (req.method === 'DELETE' && parts.length === 3 && store.trackedMap()[id]) {
        try {
          store.setTracked(id, false);
        } catch {
          /* abaikan */
        }
        sendJson(res, 200, {
          ok: true,
          cleaned: true,
          untracked: true,
          id,
          backup: null,
          needsAdmin: false,
          font: null
        });
        return;
      }
      throw fail(404, 'Font tidak ditemukan. Pindai ulang daftar font.');
    }

    if (parts.length === 4 && parts[3] === 'file') {
      if (req.method !== 'GET' && req.method !== 'HEAD') throw fail(405, 'Metode tidak didukung.');
      serveFontFile(req, res, font);
      return;
    }

    if (parts.length === 4 && parts[3] === 'track') {
      if (req.method !== 'POST') throw fail(405, 'Metode tidak didukung.');
      const body = await readJsonBody(req);
      const shouldTrack = body.tracked == null ? !font.tracked : !!body.tracked;
      const result = store.setTracked(id, shouldTrack, trackMetaFor(id, {
        family: font.family,
        subfamily: font.subfamily,
        fileName: font.fileName,
        filePath: font.filePath
      }));
      sendJson(res, 200, { ok: true, tracked: result.tracked, id });
      return;
    }

    if (parts.length === 4 && parts[3] === 'reveal') {
      if (req.method !== 'POST') throw fail(405, 'Metode tidak didukung.');
      const result = await manage.revealInExplorer(font);
      sendJson(res, 200, result);
      return;
    }

    if (parts.length === 3) {
      if (req.method === 'DELETE') {
        const keepBackup = url.searchParams.get('backup') !== '0';
        const result = await manage.deleteFont(font, {
          backup: keepBackup,
          progressId: url.searchParams.get('progressId')
        });
        sendJson(res, result.ok ? 200 : 207, result);
        return;
      }
      if (req.method === 'GET') {
        const tracked = store.trackedMap();
        font.tracked = !!tracked[font.id];
        sendJson(res, 200, { font });
        return;
      }
      throw fail(405, 'Metode tidak didukung.');
    }

    throw fail(404, 'Endpoint font tidak dikenal.');
  }

  if (resource === 'install' && parts.length === 2) {
    if (req.method !== 'POST') throw fail(405, 'Metode tidak didukung.');
    const filename = url.searchParams.get('filename') || req.headers['x-font-name'] || 'font.ttf';
    const body = await readBody(req, MAX_INSTALL_BYTES + 4096);
    const result = await manage.installFont(body, String(filename));
    sendJson(res, 200, result);
    return;
  }

  if (resource === 'backups') {
    if (parts.length === 2) {
      if (req.method !== 'GET') throw fail(405, 'Metode tidak didukung.');
      const items = store.listBackups().map((item) => ({
        ...item,
        exists: fs.existsSync(path.join(store.BACKUP_DIR, item.file))
      }));
      sendJson(res, 200, {
        items,
        totalSize: items.reduce((sum, item) => sum + (item.size || 0), 0),
        dir: store.BACKUP_DIR
      });
      return;
    }

    const id = parts[2];
    if (parts.length === 3) {
      if (req.method === 'DELETE') {
        sendJson(res, 200, manage.removeBackup(id));
        return;
      }
      if (req.method === 'GET') {
        const backup = store.getBackup(id);
        if (!backup) throw fail(404, 'Cadangan tidak ditemukan.');
        sendJson(res, 200, { backup });
        return;
      }
      throw fail(405, 'Metode tidak didukung.');
    }

    if (parts.length === 4 && parts[3] === 'restore') {
      if (req.method !== 'POST') throw fail(405, 'Metode tidak didukung.');
      const body = await readJsonBody(req);
      const result = await manage.restoreBackup(id, { progressId: body.progressId });
      sendJson(res, result.ok ? 200 : 207, result);
      return;
    }

    throw fail(404, 'Endpoint cadangan tidak dikenal.');
  }

  if (resource === 'scan' && parts.length === 2) {
    if (req.method !== 'POST') throw fail(405, 'Metode tidak didukung.');
    scanner.invalidateScan();
    sendFontsPayload(res, 200, await fontsPayload(true));
    return;
  }

  throw fail(404, 'Endpoint API tidak ditemukan.');
}

const server = http.createServer(async (req, res) => {
  const startedAt = Date.now();
  let pathname = '/';
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || HOST}`);
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      throw fail(400, 'Path permintaan tidak valid.');
    }
    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, url, pathname);
    } else {
      serveStatic(req, res, pathname);
    }
  } catch (error) {
    const status = error.status || 500;
    if (!res.headersSent) {
      sendJson(res, status, { error: error.message || 'Terjadi kesalahan internal.' });
    } else {
      try {
        res.end();
      } catch {
        /* abaikan */
      }
    }
    if (status >= 500) {
      console.error(`[font-manager] ${req.method} ${pathname} → ${status}:`, error);
    }
  } finally {
    if (process.env.FM_DEBUG) {
      console.log(`[font-manager] ${req.method} ${pathname} ${res.statusCode} ${Date.now() - startedAt}ms`);
    }
  }
});

async function listenWithFallback(startPort) {
  let lastError = null;
  for (let offset = 0; offset < 12; offset++) {
    const port = startPort + offset;
    try {
      await new Promise((resolve, reject) => {
        const onError = (error) => {
          server.removeListener('listening', onListening);
          reject(error);
        };
        const onListening = () => {
          server.removeListener('error', onError);
          resolve();
        };
        server.once('error', onError);
        server.once('listening', onListening);
        server.listen(port, HOST);
      });
      return port;
    } catch (error) {
      lastError = error;
      if (error.code !== 'EADDRINUSE' && error.code !== 'EACCES') break;
    }
  }
  throw lastError || new Error('Tidak ada port yang tersedia.');
}

function openDesktopApp() {
  const host = path.join(__dirname, 'desktop', 'FontManager.exe');
  if (!fs.existsSync(host)) {
    console.warn('  Aplikasi desktop belum dibuat; jalankan desktop\\build-desktop.bat.');
    console.log(`  Buka manual: ${`http://${HOST}:${activePort}`}`);
    return;
  }

  const command = `start \"\" \"${host}\" \"http://${HOST}:${activePort}\"`;
  exec(command, { windowsHide: true }, (error) => {
    if (error) console.error('  Tidak dapat membuka jendela Font Manager:', error.message);
  });
}

async function main() {
  activePort = await listenWithFallback(START_PORT);
  const url = `http://${HOST}:${activePort}`;
  try {
    const removedBackups = store.reconcileBackups();
    if (removedBackups.length) {
      console.log(`  ${removedBackups.length} berkas cadangan yatim dibersihkan.`);
    }
  } catch (error) {
    console.warn('  Rekonsiliasi cadangan dilewati:', error.message);
  }
  console.log('');
  console.log('  Font Manager siap');
  console.log(`  → ${url}`);
  console.log(`  Folder font: ${scanner.systemFontsDir()}`);
  console.log(`  Folder pengguna: ${scanner.userFontsDir()}`);
  console.log('  Tekan Ctrl+C untuk berhenti.');
  console.log('');

  scanner
    .scanFonts({ force: true })
    .then((data) => {
      console.log(`  ${data.stats.total} font terdeteksi dalam ${data.scanDurationMs} ms.`);
    })
    .catch((error) => console.error('  Pemindaian awal gagal:', error.message));

  if (process.env.FM_NO_OPEN !== '1' && process.platform === 'win32') {
    openDesktopApp();
  }
}

process.on('SIGINT', () => {
  console.log('\n  Menghentikan Font Manager…');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1500).unref();
});

// Ketika dijalankan oleh host desktop, ikut berhenti bila host sudah tidak ada.
const parentPid = Number(process.env.FM_PARENT_PID || 0);
if (parentPid > 0) {
  const watchdog = setInterval(() => {
    try {
      process.kill(parentPid, 0);
    } catch {
      clearInterval(watchdog);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(0), 1000).unref();
    }
  }, 4000);
  watchdog.unref();
}

main().catch((error) => {
  console.error('Font Manager gagal dijalankan:', error.message);
  process.exit(1);
});
