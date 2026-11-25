'use strict';

/* ---------------------------------------------------------------- ikon */

const ICONS = {
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  monitor:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="3.5" width="19" height="13" rx="2"/><path d="M8 20.5h8"/><path d="M12 16.5v4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  folder:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
  adobe:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 3.5 20.5h5.2l1.1-2.6h4.4l1.1 2.6h5.2L12 3.5Z"/><path d="M9.3 13.2h5.4L12 7.2Z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L3.6 9.8l6.5-.9Z"/></svg>',
  alert:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10.3 3.6-8 14A2 2 0 0 0 4 20.6h16a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  archive:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>',
  refresh:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  upload:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 9 5-5 5 5"/><path d="M12 4v12"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5 11-11"/></svg>',
  select:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7.5 12 3 3 6-6"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M5 6v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/><path d="M10 11v5M14 11v5"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  restore:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4"/><path d="M3 3v6h6"/><path d="M12 7v5l3 2"/></svg>',
  arrowLeft:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>',
  external:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>'
};

function icon(name, cls) {
  const node = el('span', { class: 'icon' + (cls ? ' ' + cls : ''), 'aria-hidden': 'true' });
  node.innerHTML = ICONS[name] || ICONS.info;
  return node;
}

function applyIcons(root = document) {
  for (const node of root.querySelectorAll('[data-icon]')) {
    const svg = ICONS[node.dataset.icon];
    if (!svg) continue;
    node.innerHTML = svg;
    node.removeAttribute('data-icon');
  }
}

/* --------------------------------------------------------------- utilitas */

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function logoMark() {
  return el('img', { src: '/favicon.svg', alt: '', width: 36, height: 36, decoding: 'async' });
}

function el(tag, props, ...children) {
  const node = document.createElement(tag);
  if (props && typeof props === 'object' && !(props instanceof Node)) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
      else if (key === 'html') node.innerHTML = value;
      else if (key === 'dataset') Object.assign(node.dataset, value);
      else if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else node.setAttribute(key, value === true ? '' : String(value));
    }
  } else if (props !== undefined && props !== null) {
    children.unshift(props);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

function debounce(fn, wait) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, wait);
  };
}

const { t, tp } = window.I18N;

/* Pengenal angka/tanggal/urutan mengikuti bahasa antarmuka yang dipilih. */
let numberFormat = new Intl.NumberFormat(window.I18N.localeTag());
let dateTimeFormat = new Intl.DateTimeFormat(window.I18N.localeTag(), {
  dateStyle: 'medium',
  timeStyle: 'short'
});
let timeFormat = new Intl.DateTimeFormat(window.I18N.localeTag(), {
  hour: '2-digit',
  minute: '2-digit'
});
let byName = new Intl.Collator(window.I18N.localeTag().slice(0, 2), {
  sensitivity: 'base',
  numeric: true
}).compare;

function applyLocaleFormats() {
  const tag = window.I18N.localeTag();
  numberFormat = new Intl.NumberFormat(tag);
  dateTimeFormat = new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short' });
  timeFormat = new Intl.DateTimeFormat(tag, { hour: '2-digit', minute: '2-digit' });
  byName = new Intl.Collator(tag.slice(0, 2), { sensitivity: 'base', numeric: true }).compare;
}

function fmtNumber(value) {
  return numberFormat.format(Number(value) || 0);
}

function fmtBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let size = value / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  const pecahan = size >= 100 ? String(Math.round(size)) : size.toFixed(1);
  const nilai = window.I18N.getLanguage() === 'en' ? pecahan : pecahan.replace('.', ',');
  return `${nilai} ${units[unit]}`;
}

function fmtDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateTimeFormat.format(date);
}

function fmtTime(value) {
  if (!value) return t('baru saja');
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? t('baru saja') : timeFormat.format(date);
}

function norm(value) {
  return String(value || '').toLowerCase();
}

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
}

/* ---------------------------------------------------------------- status */

const SOURCE_LABELS = {
  system: 'Sistem',
  user: 'Pengguna',
  custom: 'Kustom',
  adobe: 'Adobe Fonts',
  tracked: 'Tidak terdeteksi'
};
const VIEWS = {
  all: {
    title: 'Semua keluarga font',
    sub: 'Berkas font digabungkan per keluarga agar setiap gaya tampil dalam satu kartu'
  },
  system: {
    title: 'Font sistem',
    sub: 'Keluarga font yang terpasang untuk semua pengguna Windows'
  },
  user: {
    title: 'Font pengguna',
    sub: 'Keluarga font yang terpasang khusus untuk akun Anda'
  },
  custom: {
    title: 'Font kustom',
    sub: 'Keluarga font dari folder tambahan di luar folder font Windows'
  },
  adobe: {
    title: 'Font Adobe',
    sub: 'Font langganan Adobe Fonts yang aktif di Creative Cloud'
  },
  tracked: {
    title: 'Dilacak',
    sub: 'Keluarga font yang Anda tandai untuk dipantau'
  },
  missing: {
    title: 'Entri bermasalah',
    sub: 'Keluarga dengan berkas hilang atau entri registri menggantung'
  }
};

const state = {
  fonts: [],
  fontById: new Map(),
  families: [],
  familyByKey: new Map(),
  stats: null,
  warnings: [],
  scannedAt: null,
  view: 'all',
  query: '',
  sort: 'family',
  sample: '',
  size: 34,
  tracked: new Set(),
  trackedMeta: {},
  fontsVersion: 0,
  trackVersion: 0,
  filterKey: '',
  list: [],
  rendered: 0,
  loading: true,
  activeFontId: null,
  activeFamilyKey: null,
  fileBackKey: null,
  familyPreviewId: null,
  detail: null,
  drawerLines: [],
  trackBtn: null,
  familyTrackBtn: null,
  trackBusy: new Set(),
  familyTrackBusy: new Set(),
  backups: [],
  backupsLoaded: false,
  backupsLoading: false,
  selectMode: false,
  selected: new Set()
};

const PAGE_SIZE = 60;
const NO_PREVIEW_LABEL = 'Pratinjau tidak tersedia';
// Batas aman per operasi hapus massal. Server menolak/memotong di atas ini.
const MAX_SELECTION_FILES = 2000;
const MAX_ACTIVE_FACES = 4;
const MAX_LOADED_FACES = 90;
const DEFAULT_SAMPLE = 'Hamburgefonstiv 0123';

let els = {};

/* ------------------------------------------------------------ keluarga */

const STYLE_BASE_WORDS = [
  'thin',
  'light',
  'book',
  'regular',
  'normal',
  'roman',
  'medium',
  'semi',
  'demi',
  'bold',
  'black',
  'heavy',
  'italic',
  'oblique'
];
const STYLE_PREFIX_WORDS = ['extra', 'ultra', 'semi', 'demi', 'ext', 'ult'];
const STYLE_PREFIX_BASES = STYLE_BASE_WORDS.filter(
  (word) => !['italic', 'oblique', 'regular', 'normal', 'roman'].includes(word)
);
const STYLE_ABBREVIATIONS = {
  it: 'Italic',
  ital: 'Italic',
  ita: 'Italic',
  obl: 'Oblique',
  bd: 'Bold',
  lt: 'Light',
  md: 'Medium',
  med: 'Medium',
  medi: 'Medium',
  rg: t('Regular'),
  reg: t('Regular'),
  bk: 'Black',
  blck: 'Black',
  lght: 'Light',
  hv: 'Heavy',
  th: 'Thin',
  sm: 'Semi',
  supr: 'Super',
  extlt: 'ExtraLight',
  extbd: 'ExtraBold',
  ultlt: 'UltraLight',
  ultbd: 'UltraBold',
  smbd: 'SemiBold',
  sembd: 'SemiBold',
  semibd: 'SemiBold',
  demibd: 'DemiBold',
  smallcaps: 'Small Caps',
  oldstyle: 'Old Style',
  sc: 'Small Caps',
  osf: 'Old Style'
};
const STYLE_WORD_PIECES = [
  ...STYLE_BASE_WORDS,
  ...STYLE_PREFIX_WORDS.flatMap((prefix) => STYLE_PREFIX_BASES.map((base) => prefix + base)),
  ...Object.keys(STYLE_ABBREVIATIONS)
].sort((a, b) => b.length - a.length);

const STYLE_WORD_LABELS = {
  thin: 'Thin',
  light: 'Light',
  book: 'Book',
  regular: t('Regular'),
  normal: 'Normal',
  roman: 'Roman',
  medium: 'Medium',
  semi: 'Semi',
  demi: 'Demi',
  bold: 'Bold',
  black: 'Black',
  heavy: 'Heavy',
  italic: 'Italic',
  oblique: 'Oblique'
};
const STYLE_PREFIX_LABELS = {
  extra: 'Extra',
  ultra: 'Ultra',
  semi: 'Semi',
  demi: 'Demi',
  ext: 'Extra',
  ult: 'Ultra'
};
const GENERIC_FAMILY_NAMES = /^(font|fonts|new font|untitled|regular|normal|default|myfont)$/i;
const baseNameCache = new WeakMap();

function isStylePrefix(word) {
  return STYLE_PREFIX_WORDS.includes(String(word || '').toLowerCase());
}

function styleWordLabel(piece) {
  if (STYLE_ABBREVIATIONS[piece]) return STYLE_ABBREVIATIONS[piece];
  for (const prefix of STYLE_PREFIX_WORDS) {
    if (piece.startsWith(prefix)) {
      const base = piece.slice(prefix.length);
      if (STYLE_WORD_LABELS[base]) return STYLE_PREFIX_LABELS[prefix] + STYLE_WORD_LABELS[base];
    }
  }
  return STYLE_WORD_LABELS[piece] || piece;
}

function parseStyleWord(word) {
  const raw = String(word || '');
  // "LT" pada nama keluarga seperti AGaramond LT / Helvetica LT adalah
  // penanda foundry (Linotype), bukan singkatan Light.
  if (/^LT(?![a-z])/.test(raw)) return null;
  let rest = raw.toLowerCase();
  if (!rest) return null;
  const tokens = [];
  while (rest) {
    const piece = STYLE_WORD_PIECES.find((candidate) => rest.startsWith(candidate));
    if (!piece) return null;
    const label = styleWordLabel(piece);
    if (!tokens.includes(label)) tokens.push(label);
    rest = rest.slice(piece.length);
  }
  return tokens;
}

function splitNameWords(name) {
  const text = String(name || '');
  const words = [];
  let start = -1;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (!/[\p{L}\p{N}]/u.test(char)) {
      if (start >= 0) {
        words.push({ text: text.slice(start, index), start });
        start = -1;
      }
      continue;
    }
    if (start < 0) {
      start = index;
      continue;
    }
    if (/[a-z]/.test(text[index - 1]) && /[A-Z]/.test(char)) {
      words.push({ text: text.slice(start, index), start });
      start = index;
    }
  }
  if (start >= 0) words.push({ text: text.slice(start), start });
  return words;
}

function stripTrailingStyles(name) {
  const text = String(name || '').trim();
  if (!text) return text;
  const words = splitNameWords(text);
  let cut = text.length;

  for (let index = words.length - 1; index >= 0; index--) {
    let tokens = parseStyleWord(words[index].text);
    let start = words[index].start;

    if (!tokens && index > 0) {
      tokens = parseStyleWord(words[index - 1].text + words[index].text);
      if (tokens) start = words[index - 1].start;
    }

    if (!tokens && index + 1 < words.length) {
      tokens = parseStyleWord(words[index].text + words[index + 1].text);
      if (tokens) {
        cut = words[index].start;
        continue;
      }
    }

    if (!tokens) break;
    cut = start;
  }

  if (cut === text.length) return text;
  const base = text.slice(0, cut).replace(/[\s._\-–—()\[\]]+$/g, '').trim();
  return base.length >= 2 ? base : text;
}

function styleTokensIn(text) {
  const words = splitNameWords(text);
  const tokens = [];

  for (let index = 0; index < words.length; index++) {
    let found = parseStyleWord(words[index].text);
    if (!found && index + 1 < words.length) {
      found = parseStyleWord(words[index].text + words[index + 1].text);
      if (found) index++;
    }
    if (!found) continue;
    for (const token of found) {
      if (!tokens.includes(token)) tokens.push(token);
    }
  }
  return tokens;
}

function isPureStyleText(text) {
  const words = splitNameWords(text);
  if (!words.length) return false;

  for (let index = 0; index < words.length; index++) {
    let found = parseStyleWord(words[index].text);
    if (!found && index + 1 < words.length) {
      found = parseStyleWord(words[index].text + words[index + 1].text);
      if (found) index++;
    }
    if (!found) return false;
  }
  return true;
}

function formatStyleTokens(tokens) {
  const list = (tokens || []).filter(Boolean);
  if (!list.length) return '';
  const italics = list.filter((token) => token === 'Italic' || token === 'Oblique');
  const weights = list.filter(
    (token) => !['Italic', 'Oblique', t('Regular'), 'Normal', 'Roman'].includes(token)
  );

  let label = weights.join(' ');
  if (!label) {
    if (italics.length) return italics[0];
    return list[0];
  }
  if (italics.length) label += ` ${italics[0]}`;
  return label;
}

function cleanStyleText(text) {
  return String(text || '')
    .replace(/_+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isGarbageSubfamily(value) {
  const text = String(value || '').trim();
  return !text || !/[\p{L}\p{N}]/u.test(text);
}

function fileNameBase(fileName) {
  return String(fileName || '')
    .replace(/\.[a-z0-9]{1,5}$/i, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/_+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function effectiveFamilyFor(font) {
  let family = String((font && font.family) || '').trim();
  if (!family || GENERIC_FAMILY_NAMES.test(family)) {
    const fromFile = fileNameBase(font && font.fileName);
    if (fromFile) return { family: fromFile, fromFileName: true };
  }
  return { family, fromFileName: !!(font && font.familyFromFileName) };
}

function conservativeBaseFor(font) {
  const { family, fromFileName } = effectiveFamilyFor(font);
  if (!family) return String((font && (font.fileName || font.id)) || '');

  const base = stripTrailingStyles(family);
  if (base === family || base.length < 2) return family;
  if (fromFileName) return base;

  const sub = String((font && font.subfamily) || '').trim();
  const removedTokens = styleTokensIn(family.slice(base.length));
  const subTokens = styleTokensIn(sub);
  const shouldStrip =
    isGarbageSubfamily(sub) ||
    norm(sub) === norm(family) ||
    (subTokens.length > 0 &&
      removedTokens.length > 0 &&
      subTokens.every((token) => removedTokens.includes(token)));

  return shouldStrip ? base : family;
}

let knownBaseKeys = new Set();
let legacyBaseMap = new Map();
let realBaseKeys = new Set();

function oneWordStyleBase(name) {
  const text = String(name || '').trim();
  if (!text) return null;
  const words = splitNameWords(text);
  if (!words.length) return null;
  const last = words[words.length - 1];
  const word = last.text;
  if (word.length < 5) return null;

  for (let cut = 3; cut < word.length; cut++) {
    const baseWord = word.slice(0, cut);
    if (isPureStyleText(baseWord)) continue;

    const suffix = word.slice(cut);
    // Abreviasi 2–3 huruf (th, lt, it, rg, sc, …) terlalu rawan
    // menangkap akhir nama keluarga biasa seperti "Sloth" atau "Bilderberg".
    if (suffix.length < 4) continue;
    // Gaya pada nama keluarga tanpa pemisah hampir selalu dimulai huruf
    // kapital (AmlightSemiBold, FilsonProBlack); "Moonlight" bukan style Light.
    // Pengecualian: sufiks panjang huruf kecil seperti "POSTRESSoblique".
    if (!/[A-Z]/.test(word[cut]) && suffix.length < 5) continue;
    const tokens = parseStyleWord(suffix);
    if (!tokens) continue;
    // "Roman" pada GeologicaRoman adalah varian desain, bukan gaya.
    if (tokens.every((token) => token === 'Roman')) continue;

    const base = text
      .slice(0, last.start + cut)
      .replace(/[\s._\-–—()\[\]]+$/g, '')
      .trim();
    if (base.length < 3) continue;
    if (isPureStyleText(base)) continue;
    if (oneWordStyleBase(base)) continue;

    return { base, tokens };
  }

  return null;
}

function expandedBaseFor(font, conservative) {
  if (!knownBaseKeys.size) return conservative;
  const { family, fromFileName } = effectiveFamilyFor(font);
  if (!family || fromFileName) return conservative;

  const stripped = stripTrailingStyles(family);
  if (stripped !== family && stripped.length >= 2 && knownBaseKeys.has(familyKey(stripped))) {
    const suffixTokens = styleTokensIn(family.slice(stripped.length));
    // "Roman" pada keluarga seperti Geologica Roman adalah varian desain
    // tersendiri, bukan sekadar gaya dari keluarga dasarnya.
    const romanOnly = suffixTokens.length > 0 && suffixTokens.every((token) => token === 'Roman');
    if (suffixTokens.length && !romanOnly) return stripped;
  }

  const oneWord = oneWordStyleBase(conservative);
  if (oneWord && realBaseKeys.has(familyKey(oneWord.base))) return oneWord.base;

  return conservative;
}

function groupingBaseFor(font) {
  if (!font) return '';
  const cached = baseNameCache.get(font);
  if (cached) return cached;

  const conservative = conservativeBaseFor(font);
  const base = expandedBaseFor(font, conservative);
  const { family, fromFileName } = effectiveFamilyFor(font);
  let legacyBase = null;
  if (!fromFileName) {
    legacyBase =
      legacyBaseMap.get(familyKey(family)) ||
      legacyBaseMap.get(familyKey(base)) ||
      legacyBaseMap.get(familyKey(stripTrailingStyles(base)));
  }
  const resolved = legacyBase || base;
  baseNameCache.set(font, resolved);
  return resolved;
}

/* --- Pola penamaan lama: berat/gaya menempel pada nama keluarga ---
   Contoh: "Franklin Gothic Book" (subfamily Regular), "Futura Md BT" (Medium),
   "Futura Round Cond Bold". Aturan ini hanya dipakai bila beberapa keluarga
   berbeda menunjuk ke basis yang sama, sehingga keluarga tunggal tidak berubah. */

const FOUNDRY_MARKERS = new Set(['BT', 'LT', 'MT', 'PT', 'Std', 'Pro', 'PS', 'URW']);

const LEGACY_PIECES = [
  ['condensed', 'Condensed'],
  ['compressed', 'Compressed'],
  ['extcond', 'Condensed'],
  ['extended', 'Extended'],
  ['expanded', 'Expanded'],
  ['extrabold', 'ExtraBold'],
  ['extralight', 'ExtraLight'],
  ['ultrabold', 'UltraBold'],
  ['ultralight', 'UltraLight'],
  ['semibold', 'SemiBold'],
  ['demibold', 'DemiBold'],
  ['xblack', 'ExtraBlack'],
  ['xlight', 'ExtraLight'],
  ['xheavy', 'ExtraHeavy'],
  ['xbold', 'ExtraBold'],
  ['hairline', 'Hairline'],
  ['extra', 'Extra'],
  ['ultra', 'Ultra'],
  ['narrow', 'Narrow'],
  ['medium', 'Medium'],
  ['regular', t('Regular')],
  ['normal', 'Normal'],
  ['cond', 'Condensed'],
  ['cn', 'Condensed'],
  ['cmp', 'Compressed'],
  ['wide', 'Wide'],
  ['expd', 'Expanded'],
  ['extbd', 'ExtraBold'],
  ['extlt', 'ExtraLight'],
  ['ultbd', 'UltraBold'],
  ['ultlt', 'UltraLight'],
  ['sembd', 'SemiBold'],
  ['semibd', 'SemiBold'],
  ['demibd', 'DemiBold'],
  ['italic', 'Italic'],
  ['oblique', 'Oblique'],
  ['light', 'Light'],
  ['black', 'Black'],
  ['heavy', 'Heavy'],
  ['bold', 'Bold'],
  ['book', 'Book'],
  ['semi', 'Semi'],
  ['demi', 'Demi'],
  ['thin', 'Thin'],
  ['med', 'Medium'],
  ['medi', 'Medium'],
  ['blk', 'Black'],
  ['lght', 'Light'],
  ['ital', 'Italic'],
  ['obl', 'Oblique'],
  ['ita', 'Italic'],
  ['nar', 'Narrow'],
  ['exp', 'Expanded'],
  ['bd', 'Bold'],
  ['bk', 'Book'],
  ['hv', 'Heavy'],
  ['md', 'Medium'],
  ['lt', 'Light'],
  ['rg', t('Regular')],
  ['th', 'Thin'],
  ['it', 'Italic'],
  ['l', 'Light']
].sort((a, b) => b[0].length - a[0].length);

const LEGACY_WIDTH_LABELS = new Set([
  'Condensed',
  'Compressed',
  'Narrow',
  'Extended',
  'Wide',
  'Expanded'
]);
const LEGACY_ITALIC_LABELS = new Set(['Italic', 'Oblique']);
const LEGACY_PREFIX_LABELS = new Set(['Extra', 'Ultra']);

function parseLegacyStyleWord(word) {
  let rest = String(word || '').toLowerCase();
  if (!rest) return null;
  const tokens = [];

  while (rest) {
    // "X" sebagai awalan (XBlack, XLight) hanya bila diikuti kata gaya lain.
    if (rest[0] === 'x' && rest.length > 1 && !tokens.includes('Extra')) {
      const tail = parseLegacyStyleWord(rest.slice(1));
      if (tail) return tokens.concat(['Extra'], tail);
    }
    let matched = null;
    for (const [piece, label] of LEGACY_PIECES) {
      if (!rest.startsWith(piece)) continue;
      if (piece.length === 1 && rest.length !== 1) continue;
      matched = { piece, label };
      break;
    }
    if (!matched) return null;
    if (!tokens.includes(matched.label)) tokens.push(matched.label);
    rest = rest.slice(matched.piece.length);
  }
  return tokens;
}

function isLegacyAbbreviation(word) {
  const text = String(word || '');
  if (!text) return false;
  if (text.length <= 3) return true;
  if (/^X[a-z]{1,3}/i.test(text) && text.length <= 4) return true;
  return false;
}

function isLegacyWeightToken(token) {
  return (
    !LEGACY_WIDTH_LABELS.has(token) &&
    !LEGACY_ITALIC_LABELS.has(token) &&
    !LEGACY_PREFIX_LABELS.has(token)
  );
}

function legacyBaseFor(family) {
  const text = String(family || '').trim();
  const words = splitNameWords(text);
  if (words.length < 2) return null;

  let marker = null;
  let end = words.length;
  const lastWord = words[words.length - 1].text;
  if (FOUNDRY_MARKERS.has(lastWord)) {
    marker = lastWord;
    end = words.length - 1;
  }
  if (end < 2) return null;

  const keep = [words[0].text];
  let removedWeight = false;

  for (let index = 1; index < end; index++) {
    const word = words[index].text;
    if (FOUNDRY_MARKERS.has(word)) {
      keep.push(word);
      continue;
    }

    // Potongan camel-case tanpa pemisah ("LtCn", "XBlkCnIt") dibaca sebagai
    // satu kata gaya hanya bila seluruh rangkaiannya memang token gaya.
    // "BookCondC" tetap dipecah per kata agar "Cond" tidak ikut terhapus.
    let runEnd = index + 1;
    while (runEnd < end && isLegacyAbbreviation(word)) {
      const previous = words[runEnd - 1];
      const current = words[runEnd];
      if (current.start !== previous.start + previous.text.length) break;
      if (FOUNDRY_MARKERS.has(current.text)) break;
      // Hanya potongan singkat (Lt, Cn, It, Xblk) yang digabung; kata penuh
      // seperti "Condensed" atau "Book" tetap berdiri sendiri.
      if (!isLegacyAbbreviation(current.text)) break;
      runEnd++;
    }
    const runText = text.slice(words[index].start, words[runEnd - 1].start + words[runEnd - 1].text.length);
    const runTokens = runEnd > index + 1 ? parseLegacyStyleWord(runText) : null;

    let tokens = runTokens;
    if (tokens) {
      index = runEnd - 1;
    } else {
      tokens = parseLegacyStyleWord(word);
    }

    if (!tokens) {
      keep.push(word);
      continue;
    }
    const hasWeight = tokens.some(isLegacyWeightToken);
    const hasWidth = tokens.some((token) => LEGACY_WIDTH_LABELS.has(token));
    const hasItalic = tokens.some((token) => LEGACY_ITALIC_LABELS.has(token));
    const prefixOnly =
      !hasWeight && !hasWidth && !hasItalic && tokens.every((token) => LEGACY_PREFIX_LABELS.has(token));

    // Kata bergaya (berat, miring, atau kata penuh seperti LtCn) dibuang.
    if (hasWeight || hasItalic) {
      removedWeight = true;
      continue;
    }
    // "Extra"/"Ultra" tanpa lebar hanya pelengkap kata berat berikutnya.
    if (prefixOnly) continue;
    keep.push(word);
  }

  if (!removedWeight) return null;
  const baseWords = marker ? keep.concat(marker) : keep;
  const base = baseWords.join(' ');
  if (!base || familyKey(base) === familyKey(text)) return null;
  return base;
}

function computeLegacyBases(fonts) {
  const candidates = new Map();
  const seen = new Set();
  const knownFamilyKeys = new Set();

  for (const font of fonts) {
    const { family } = effectiveFamilyFor(font);
    if (!family) continue;
    knownFamilyKeys.add(familyKey(family));
    const stripped = stripTrailingStyles(family);
    if (stripped && stripped !== family) knownFamilyKeys.add(familyKey(stripped));
  }

  for (const font of fonts) {
    const { family, fromFileName } = effectiveFamilyFor(font);
    if (!family || fromFileName) continue;
    const familyKeyValue = familyKey(family);
    if (!familyKeyValue || seen.has(familyKeyValue)) continue;
    seen.add(familyKeyValue);

    const base = legacyBaseFor(family);
    if (!base) continue;
    const key = familyKey(base);
    if (!key) continue;
    const entry = candidates.get(key) || { base, sources: new Set() };
    entry.sources.add(familyKeyValue);
    candidates.set(key, entry);
  }

  const map = new Map();
  for (const [key, entry] of candidates) {
    // Aman bila ada minimal dua keluarga bersaudara, atau bila basis hasil
    // penggabungan memang sudah ada sebagai keluarga tersendiri.
    if (entry.sources.size < 2 && !knownFamilyKeys.has(key)) continue;
    for (const source of entry.sources) map.set(source, entry.base);
  }
  return map;
}

function familyKey(value) {
  return norm(value)
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function cleanFamilyDisplay(name) {
  const cleaned = String(name || '')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/_+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || String(name || '').trim();
}

function familyDisplayFor(files) {
  const candidates = new Map();

  for (const font of files) {
    const name = cleanFamilyDisplay(groupingBaseFor(font));
    const key = familyKey(name);
    if (!key) continue;
    const entry = candidates.get(key) || { name, count: 0, spaced: /\s/.test(name) };
    entry.count++;
    if (!entry.spaced && /\s/.test(name)) {
      entry.name = name;
      entry.spaced = true;
    }
    candidates.set(key, entry);
  }

  let best = null;
  for (const entry of candidates.values()) {
    if (
      !best ||
      entry.count > best.count ||
      (entry.count === best.count && entry.spaced && !best.spaced)
    ) {
      best = entry;
    }
  }

  if (best) return best.name;
  return cleanFamilyDisplay(
    String((files[0] && (files[0].family || files[0].fileName)) || t('Font tanpa nama'))
  );
}

function groupKeyFor(font) {
  const base = groupingBaseFor(font);
  return (
    familyKey(base) ||
    familyKey(font.family) ||
    familyKey(font.fileName) ||
    String(font.id || '')
  );
}

function nameSuffix(value, base) {
  const source = String(value || '');
  const baseKey = familyKey(base);
  if (!baseKey) return source;
  const sourceKey = familyKey(source);
  if (!sourceKey.startsWith(baseKey)) return source;

  const target = Array.from(baseKey).length;
  let consumed = 0;
  let index = 0;
  for (const char of source) {
    if (/[\p{L}\p{N}]/u.test(char)) {
      if (consumed >= target) break;
      consumed++;
    }
    index += char.length;
  }
  return source.slice(index);
}

function isItalicStyleToken(token) {
  return token === 'Italic' || token === 'Oblique';
}

function isPlainStyleToken(token) {
  return token === t('Regular') || token === 'Normal' || token === 'Roman';
}

function isFeatureStyleToken(token) {
  return token === 'Small Caps' || token === 'Old Style';
}

function nonPlainStyleTokens(tokens) {
  return tokens.filter((token) => !isPlainStyleToken(token) && !isItalicStyleToken(token));
}

function sameStyleTokens(a, b) {
  return a.length === b.length && a.every((token) => b.includes(token));
}

function legacyStyleTokensFor(font, base) {
  const suffix = nameSuffix(font.family, base);
  const words = splitNameWords(suffix);
  const tokens = [];
  for (const word of words) {
    if (FOUNDRY_MARKERS.has(word.text)) continue;
    const parsed = parseLegacyStyleWord(word.text);
    if (!parsed) continue;
    for (const token of parsed) {
      if (!tokens.includes(token)) tokens.push(token);
    }
  }
  return tokens;
}

function styleLabel(font, group) {
  const base = group ? group.family : groupingBaseFor(font);
  const subRaw = String(font.subfamily || '').trim();
  const sub = subRaw ? nameSuffix(subRaw, base).trim() : '';
  const familyTokens = styleTokensIn(nameSuffix(font.family, base));
  const subTokens = styleTokensIn(sub);
  const fileTokens = styleTokensIn(nameSuffix(fileNameBase(font.fileName), base));
  const fullTokens = styleTokensIn(nameSuffix(font.fullName || '', base));

  if (sub && !isGarbageSubfamily(sub) && !isPureStyleText(sub)) {
    const descriptor = cleanStyleText(sub) || t('Regular');
    const descriptorHasItalic =
      subTokens.some(isItalicStyleToken) || /\b(italic|oblique)\b/i.test(sub);
    const extraWeights = nonPlainStyleTokens(familyTokens).filter(
      (token) => !subTokens.includes(token)
    );
    const prefix = formatStyleTokens(extraWeights);
    const italic =
      familyTokens.find(isItalicStyleToken) ||
      fileTokens.find(isItalicStyleToken) ||
      fullTokens.find(isItalicStyleToken) ||
      (font.italic ? 'Italic' : null);
    const parts = [];
    if (prefix) parts.push(prefix);
    if (descriptor) parts.push(descriptor);
    if (!descriptorHasItalic && italic) parts.push(italic);
    return cleanStyleText(parts.filter(Boolean).join(' ')) || t('Regular');
  }

  const baseWeights = nonPlainStyleTokens(familyTokens);
  const subWeights = nonPlainStyleTokens(subTokens);
  const fileWeights = nonPlainStyleTokens(fileTokens);
  const fullWeights = nonPlainStyleTokens(fullTokens);

  // Untuk keluarga gabungan pola lama, subfamily adalah nama gaya yang benar
  // ("Futura Bk BT" ber-subfamily Book, bukan Black), dan lebar dari nama
  // keluarga ("BdCn" = Bold Condensed) tetap ditampilkan.
  const legacyMerged = legacyBaseMap.has(familyKey(font.family));
  const legacyTokens = legacyMerged ? legacyStyleTokensFor(font, base) : [];
  const legacyWidth = legacyTokens.filter((token) => LEGACY_WIDTH_LABELS.has(token));
  const legacyWeight = legacyTokens.filter(
    (token) => isLegacyWeightToken(token) || LEGACY_PREFIX_LABELS.has(token)
  );

  let weights;
  if (legacyMerged && subWeights.length) {
    weights = subWeights;
  } else if (legacyMerged && legacyWeight.length) {
    weights = legacyWeight;
  } else if (baseWeights.length) {
    const baseHasWeight = baseWeights.some((token) => !isFeatureStyleToken(token));
    if (!baseHasWeight && subWeights.length) {
      weights = [
        ...subWeights,
        ...baseWeights.filter((token) => !subWeights.includes(token))
      ];
    } else {
      weights = baseWeights;
    }
  } else if (
    fileWeights.length &&
    (subWeights.length === 0 || !sameStyleTokens(fileWeights, subWeights))
  ) {
    weights = fileWeights;
  } else if (subWeights.length) {
    weights = subWeights;
  } else if (fullWeights.length) {
    weights = fullWeights;
  } else {
    weights = [];
  }

  const italic =
    familyTokens.find(isItalicStyleToken) ||
    subTokens.find(isItalicStyleToken) ||
    fileTokens.find(isItalicStyleToken) ||
    fullTokens.find(isItalicStyleToken) ||
    (font.italic ? 'Italic' : null);

  const formatted = formatStyleTokens([
    ...weights,
    ...(legacyMerged ? legacyWidth : []),
    ...(italic ? [italic] : [])
  ]);
  if (formatted) return formatted;

  const plain =
    familyTokens.find(isPlainStyleToken) ||
    subTokens.find(isPlainStyleToken) ||
    fileTokens.find(isPlainStyleToken) ||
    fullTokens.find(isPlainStyleToken);
  if (plain) return plain;
  return font.italic ? 'Italic' : t('Regular');
}

function fontLabel(font) {
  const group = state.familyByKey.get(groupKeyFor(font));
  const base = group ? group.family : groupingBaseFor(font);
  const style = styleLabel(font, group);
  const baseTokens = styleTokensIn(base);
  const styleTokens = styleTokensIn(style);
  const redundant =
    styleTokens.length > 0 && styleTokens.every((token) => baseTokens.includes(token));
  if (!style || style === t('Regular') || redundant) return base;
  return `${base} ${style}`;
}

function stylesOf(group) {
  return group.files.map((font) => styleLabel(font, group));
}

function styleSummary(group) {
  return Array.from(new Set(stylesOf(group))).join(' · ');
}

function styleRank(label) {
  if (/^(regular|book|normal|roman)$/i.test(label)) return 0;
  if (/italic|oblique/i.test(label)) return 1;
  return 2;
}

function finalizeFamily(group) {
  group.family = familyDisplayFor(group.files);

  const regular = group.files.find(
    (font) =>
      font.exists &&
      font.previewable &&
      styleRank(styleLabel(font, group)) === 0
  );
  const upright = group.files.find(
    (font) =>
      font.exists &&
      font.previewable &&
      !/italic|oblique/i.test(styleLabel(font, group))
  );
  group.primary =
    regular ||
    upright ||
    group.files.find((font) => font.exists && font.previewable) ||
    group.files.find((font) => font.exists) ||
    group.files[0];

  group.files.sort((a, b) => {
    const labelA = styleLabel(a, group);
    const labelB = styleLabel(b, group);
    return styleRank(labelA) - styleRank(labelB) || byName(labelA, labelB) || byName(a.fileName, b.fileName);
  });

  group.sources = new Set(group.files.map((font) => font.source));
  group.styles = new Set(stylesOf(group));
  group.formats = new Set(group.files.map((font) => font.format).filter(Boolean));
  group.anyTracked = group.files.some((font) => state.tracked.has(font.id));
  group.allTracked = group.files.length > 0 && group.files.every((font) => state.tracked.has(font.id));
  group.hasMissing = group.files.some((font) => !font.exists && !font.trackedOnly);
  group.hasProtected = group.files.some((font) => font.protected);
  group.hasOrphan = group.files.some(
    (font) => font.exists && !font.registered && font.source !== 'adobe' && font.source !== 'tracked'
  );
  group.hasTrackedOnly = group.files.some((font) => font.trackedOnly);
  group.hasVariable = group.files.some((font) => font.isVariable);
  group.hasPreviewable = group.files.some((font) => font.previewable && font.exists);
  group.hasCollection = group.files.some((font) => font.isCollection);
  group.totalSize = group.files.reduce((sum, font) => sum + (font.size || 0), 0);
  group.maxWeight = group.files.reduce((max, font) => Math.max(max, font.weightClass || 0), 0);
  group.modifiedAt = group.files.reduce((max, font) => Math.max(max, Number(font.modifiedAt) || 0), 0);

  const haystack = [group.family];
  for (const font of group.files) {
    haystack.push(
      font.family,
      font.subfamily,
      font.fullName,
      font.fileName,
      font.format,
      font.sourceLabel,
      styleLabel(font, group)
    );
  }
  group.searchText = norm(haystack.filter(Boolean).join(' '));
}

function buildFamilies(fonts) {
  knownBaseKeys = new Set();
  legacyBaseMap = computeLegacyBases(fonts);
  const baseCandidates = new Map();

  for (const font of fonts) {
    const conservative = conservativeBaseFor(font);
    knownBaseKeys.add(familyKey(conservative));
    knownBaseKeys.add(familyKey(font.family));

    const oneWord = oneWordStyleBase(conservative) || oneWordStyleBase(font.family);
    if (oneWord) {
      const key = familyKey(oneWord.base);
      const entry = baseCandidates.get(key) || { base: oneWord.base, sources: new Set() };
      entry.sources.add(familyKey(font.family));
      baseCandidates.set(key, entry);
    }
  }

  realBaseKeys = new Set();
  for (const [key, entry] of baseCandidates) {
    if (knownBaseKeys.has(key) || entry.sources.size >= 2) realBaseKeys.add(key);
  }

  const map = new Map();
  for (const font of fonts) {
    const key = groupKeyFor(font);
    let group = map.get(key);
    if (!group) {
      group = { key, files: [] };
      map.set(key, group);
    }
    group.files.push(font);
  }
  const families = Array.from(map.values());
  for (const group of families) finalizeFamily(group);
  return families;
}

function refreshFamilyTracking(group) {
  group.anyTracked = group.files.some((font) => state.tracked.has(font.id));
  group.allTracked = group.files.length > 0 && group.files.every((font) => state.tracked.has(font.id));
}

function familyCounts() {
  const counts = { all: state.families.length, system: 0, user: 0, custom: 0, adobe: 0, tracked: 0, missing: 0 };
  for (const group of state.families) {
    if (group.sources.has('system')) counts.system++;
    if (group.sources.has('user')) counts.user++;
    if (group.sources.has('custom')) counts.custom++;
    if (group.sources.has('adobe')) counts.adobe++;
    if (group.anyTracked) counts.tracked++;
    if (group.hasMissing || group.hasOrphan) counts.missing++;
  }
  return counts;
}

function previewText(entity) {
  const custom = state.sample.trim();
  if (custom) return custom;
  if (!entity) return '';
  if (Array.isArray(entity.files)) return entity.family;
  return groupingBaseFor(entity) || entity.family || entity.fileName || '';
}

function fitFontSize(text, maxSize, width) {
  const length = Math.max(1, String(text || '').length);
  const fitted = Math.floor(width / (length * 0.58));
  return Math.max(12, Math.min(maxSize, fitted));
}

function stylePreviewLines(lines, text) {
  for (const line of lines) {
    line.textContent = text;
    const max = Number(line.dataset.max) || 52;
    line.style.fontSize = `${fitFontSize(text, max, 380)}px`;
  }
}

function styleCardSample(sample, text) {
  const width = sample.closest('.card-preview')?.clientWidth || 282;
  sample.style.fontSize = `${fitFontSize(text, state.size, Math.max(180, width - 32))}px`;
  sample.classList.toggle('is-wrapped', String(text).length > 22);
}

/* ------------------------------------------------------------ face loader */

const faceObjects = new Map();
const faceStatus = new Map();
const facePending = new Map();
const faceQueue = [];
let activeFaces = 0;
let faceEpoch = 0;

/**
 * Melepas semua FontFace yang sedang dimuat/dipakai. Dipanggil sebelum
 * penghapusan agar Windows tidak mengunci berkas atau nilai registri font
 * yang sedang dipratinjau di peramban.
 */
function releasePreviewFaces() {
  faceEpoch++;
  for (const job of faceQueue.splice(0)) job.resolve(false);
  facePending.clear();
  for (const [id, face] of faceObjects) {
    try {
      document.fonts.delete(face);
    } catch {
      /* abaikan */
    }
    faceObjects.delete(id);
  }
  faceStatus.clear();
}

function ensureFace(id) {
  if (faceStatus.get(id) === 'loaded') return Promise.resolve(true);
  if (faceStatus.get(id) === 'failed') return Promise.resolve(false);
  const pending = facePending.get(id);
  if (pending) return pending;

  const promise = new Promise((resolve) => {
    faceQueue.push({ id, resolve });
    pumpFaceQueue();
  });
  facePending.set(id, promise);
  return promise;
}

function pumpFaceQueue() {
  while (activeFaces < MAX_ACTIVE_FACES && faceQueue.length) {
    const job = faceQueue.shift();
    activeFaces++;
    runFaceLoad(job).finally(() => {
      activeFaces--;
      pumpFaceQueue();
    });
  }
}

async function runFaceLoad(job) {
  const { id, resolve } = job;
  const epoch = faceEpoch;
  try {
    const face = new FontFace(`fm-${id}`, `url("/api/fonts/${encodeURIComponent(id)}/file")`);
    await face.load();
    if (epoch !== faceEpoch) {
      resolve(false);
      return;
    }
    document.fonts.add(face);
    faceObjects.set(id, face);
    faceStatus.set(id, 'loaded');
    evictFaces(id);
    resolve(true);
  } catch {
    if (epoch === faceEpoch) faceStatus.set(id, 'failed');
    resolve(false);
  } finally {
    facePending.delete(id);
  }
}

function evictFaces(keepId) {
  if (faceObjects.size <= MAX_LOADED_FACES) return;
  for (const [id, face] of faceObjects) {
    if (id === keepId) continue;
    try {
      document.fonts.delete(face);
    } catch {
      /* abaikan */
    }
    faceObjects.delete(id);
    faceStatus.delete(id);
    if (faceObjects.size <= MAX_LOADED_FACES) break;
  }
}

function applyFaceResult(card, id, ok) {
  if (!card.isConnected) return;
  card.classList.remove('is-pending');
  const group = state.familyByKey.get(card.dataset.familyKey);
  const sample = card.querySelector('.sample');

  if (ok) {
    if (sample) sample.style.fontFamily = `fm-${id}`;
    card.classList.add('is-loaded');
  } else {
    card.classList.remove('is-loaded');
    card.classList.add('is-static');
    if (sample && group) {
      sample.textContent = t(NO_PREVIEW_LABEL);
    }
  }
}

const previewObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const card = entry.target;
      previewObserver.unobserve(card);
      const group = state.familyByKey.get(card.dataset.familyKey);
      const sample = card.querySelector('.sample');
      if (sample && group) sample.textContent = previewText(group);

      const id = card.dataset.id;
      if (!id) continue;
      if (faceStatus.get(id) === 'loaded') {
        applyFaceResult(card, id, true);
        continue;
      }
      ensureFace(id).then((ok) => applyFaceResult(card, id, ok));
    }
  },
  { rootMargin: '450px 0px' }
);

const sentinelObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) appendBatch();
    }
  },
  { rootMargin: '600px 0px' }
);

/* ------------------------------------------------------------------- api */

async function api(url, options = {}) {
  const method = options.method || 'GET';
  const headers = Object.assign({}, options.headers || {});
  const init = { method, headers };
  if (method !== 'GET' && method !== 'HEAD') headers['x-fm-request'] = '1';
  if (options.json !== undefined) {
    headers['content-type'] = 'application/json';
    init.body = JSON.stringify(options.json);
  }

  const response = await fetch(url, init);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error((data && (data.error || data.message)) || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return { data, response };
}

/* ----------------------------------------------------------------- toast */

function toast(kind, message, options = {}) {
  const kindIcon = { success: 'check', error: 'alert', warn: 'alert', info: 'info' }[kind] || 'info';
  const node = el(
    'div',
    { class: `toast ${kind}`, role: 'status' },
    icon(kindIcon),
    el('div', { class: 'toast-body' }, message)
  );
  const close = el('button', { class: 'toast-close', type: 'button', 'aria-label': t('Tutup') }, icon('close'));
  node.append(close);
  if (typeof options.onClick === 'function') {
    node.classList.add('is-clickable');
    node.addEventListener('click', (event) => {
      if (event.target.closest('.toast-close')) return;
      options.onClick();
    });
  }
  els.toasts.append(node);

  let timer = null;
  const remove = () => {
    if (!node.isConnected || node.classList.contains('is-leaving')) return;
    node.classList.add('is-leaving');
    setTimeout(() => node.remove(), 220);
  };
  const timeout = options.timeout === 0 ? 0 : options.timeout || 4200;
  if (timeout) timer = setTimeout(remove, timeout);
  close.addEventListener('click', remove);

  return {
    remove,
    update(text) {
      const body = node.querySelector('.toast-body');
      if (body) body.textContent = text;
      if (timer) {
        clearTimeout(timer);
        timer = timeout ? setTimeout(remove, timeout) : null;
      }
    }
  };
}

/* ------------------------------------------------------- progres operasi */

const taskView = {
  active: false,
  finished: false,
  hidden: false,
  rows: [],
  autoClose: null,
  onKey: null,
  stickyToast: null,
  openedAt: 0
};

const TASK_STATUS = {
  pending: { text: 'Menunggu', icon: null },
  busy: { text: 'Memproses…', icon: 'spinner' },
  done: { text: 'Selesai', icon: 'check' },
  fail: { text: 'Gagal', icon: 'alert' }
};

function taskNode(id) {
  return document.getElementById(id);
}

function setTaskStatus(row, status, detail) {
  const meta = TASK_STATUS[status] || TASK_STATUS.pending;
  row.node.classList.toggle('is-busy', status === 'busy');
  row.node.classList.toggle('is-done', status === 'done');
  row.node.classList.toggle('is-fail', status === 'fail');
  const holder = row.status;
  holder.textContent = '';
  if (meta.icon === 'spinner') {
    holder.append(el('span', { class: 'task-spinner', 'aria-hidden': 'true' }));
  } else if (meta.icon) {
    holder.append(icon(meta.icon));
  }
  holder.append(document.createTextNode(detail ? t(detail) : t(meta.text)));
}

function taskGuard() {
  if (!taskView.active) return false;
  toast(
    'warn',
    taskView.hidden
      ? t('Proses font masih berjalan di latar. Tunggu sampai selesai sebelum memulai operasi lain.')
      : t('Proses font sedang berjalan di panel progres. Selesaikan atau sembunyikan panelnya.'),
    { timeout: 4200 }
  );
  return true;
}

function clearStickyToast() {
  if (taskView.stickyToast) {
    taskView.stickyToast.remove();
    taskView.stickyToast = null;
  }
}

function showTask() {
  if (!taskView.active || !taskView.hidden) return;
  taskView.hidden = false;
  clearStickyToast();
  const root = taskNode('taskRoot');
  root.hidden = false;
  requestAnimationFrame(() => root.classList.add('is-open'));
  document.body.classList.add('no-scroll');
}

function hideTask() {
  if (!taskView.active || taskView.hidden || taskView.finished) return;
  taskView.hidden = true;
  const root = taskNode('taskRoot');
  root.classList.remove('is-open');
  setTimeout(() => {
    if (taskView.hidden) root.hidden = true;
  }, 180);
  if (els.modalRoot && els.modalRoot.hidden && els.drawer && els.drawer.hidden) {
    document.body.classList.remove('no-scroll');
  }
  clearStickyToast();
  taskView.stickyToast = toast('info', t('Proses font sedang berjalan — klik untuk melihat progresnya.'), {
    timeout: 0,
    onClick: showTask
  });
}

function closeTask() {
  if (!taskView.active) return;
  if (!taskView.finished) return;
  taskView.active = false;
  taskView.finished = false;
  taskView.hidden = false;
  taskView.rows = [];
  clearStickyToast();
  if (taskView.autoClose) clearTimeout(taskView.autoClose);
  taskView.autoClose = null;
  const root = taskNode('taskRoot');
  if (root) {
    root.classList.remove('is-open');
    setTimeout(() => {
      if (!taskView.active) root.hidden = true;
    }, 180);
  }
  if (taskView.onKey) {
    document.removeEventListener('keydown', taskView.onKey);
    taskView.onKey = null;
  }
  if (els.modalRoot && !els.modalRoot.hidden) return;
  if (els.drawer && !els.drawer.hidden) return;
  document.body.classList.remove('no-scroll');
}

function openTask({ title, subtitle, hint, rows }) {
  if (taskView.autoClose) clearTimeout(taskView.autoClose);
  taskView.autoClose = null;
  if (taskView.onKey) {
    document.removeEventListener('keydown', taskView.onKey);
    taskView.onKey = null;
  }
  clearStickyToast();

  const root = taskNode('taskRoot');
  const list = taskNode('taskList');
  const bar = taskNode('taskBar');
  const fill = taskNode('taskBarFill');
  const badge = taskNode('taskBadge');
  const closeBtn = taskNode('taskClose');
  const hideBtn = taskNode('taskHide');

  taskNode('taskTitle').textContent = title;
  taskNode('taskSub').textContent = subtitle || t('Menyiapkan…');
  taskNode('taskHint').textContent = hint || '';
  taskNode('taskPercent').textContent = '0%';
  taskNode('taskCounter').textContent = '';
  badge.className = 'task-badge';
  badge.textContent = '';
  badge.append(icon('refresh'));
  bar.classList.remove('is-indeterminate');
  bar.setAttribute('aria-valuenow', '0');
  fill.style.width = '0%';
  closeBtn.hidden = true;
  if (hideBtn) hideBtn.hidden = false;
  list.textContent = '';

  const viewRows = [];
  const shown = rows.slice(0, 80);
  shown.forEach((row, index) => {
    const status = el('span', { class: 'task-row-status' });
    const node = el(
      'div',
      { class: 'task-row', role: 'listitem' },
      el('span', { class: 'task-row-name', title: row.name }, row.name),
      row.meta ? el('span', { class: 'task-row-meta' }, row.meta) : null,
      status
    );
    list.append(node);
    const entry = { node, status, name: row.name };
    viewRows.push(entry);
    setTaskStatus(entry, 'pending');
  });
  if (rows.length > shown.length) {
    list.append(
      el(
        'div',
        { class: 'task-row task-row-more' },
        el('span', { class: 'task-row-name' }, tp('+{count} berkas lainnya', { count: fmtNumber(rows.length - shown.length) }))
      )
    );
  }

  root.hidden = false;
  requestAnimationFrame(() => root.classList.add('is-open'));
  document.body.classList.add('no-scroll');
  taskView.active = true;
  taskView.finished = false;
  taskView.hidden = false;
  taskView.rows = viewRows;
  taskView.openedAt = Date.now();

  taskView.onKey = (event) => {
    if (event.key !== 'Escape') return;
    if (taskView.finished) {
      event.preventDefault();
      closeTask();
    } else if (!taskView.hidden) {
      event.preventDefault();
      hideTask();
    }
  };
  document.addEventListener('keydown', taskView.onKey);
  closeBtn.onclick = closeTask;
  if (hideBtn) hideBtn.onclick = hideTask;

  const total = rows.length;
  const counted = new Set();
  let completed = 0;

  const api = {
    rows: viewRows,
    total,
    setSubtitle(text) {
      taskNode('taskSub').textContent = text;
    },
    setHint(text) {
      taskNode('taskHint').textContent = text;
    },
    indeterminate(counterText) {
      bar.classList.add('is-indeterminate');
      bar.removeAttribute('aria-valuenow');
      taskNode('taskPercent').textContent = '…';
      if (counterText) taskNode('taskCounter').textContent = counterText;
    },
    setProgress(fraction, counterText) {
      bar.classList.remove('is-indeterminate');
      const value = Math.max(0, Math.min(1, Number(fraction) || 0));
      fill.style.width = `${(value * 100).toFixed(1)}%`;
      bar.setAttribute('aria-valuenow', String(Math.round(value * 100)));
      taskNode('taskPercent').textContent = `${Math.round(value * 100)}%`;
      if (counterText !== undefined) taskNode('taskCounter').textContent = counterText;
    },
    row(index, status, detail, autoProgress = true) {
      const isDone = status === 'done' || status === 'fail';
      // Hitung SEMUA item, termasuk yang tidak dirender (> 80 baris).
      if (isDone && index >= 0 && !counted.has(index)) {
        counted.add(index);
        completed++;
      }
      const row = viewRows[index];
      if (row) setTaskStatus(row, status, detail);
      if (isDone && autoProgress && total) {
        api.setProgress(
          completed / total,
          tp('{done} / {total}', { done: fmtNumber(completed), total: fmtNumber(total) })
        );
      }
    },
    markAll(status, detail) {
      for (let index = 0; index < total; index++) api.row(index, status, detail);
    },
    finish({ title, subtitle, hint, tone = 'done', autoClose = true }) {
      taskView.finished = true;
      bar.classList.remove('is-indeterminate');
      fill.style.width = '100%';
      bar.setAttribute('aria-valuenow', '100');
      taskNode('taskPercent').textContent = '100%';
      if (title) taskNode('taskTitle').textContent = title;
      if (subtitle !== undefined) taskNode('taskSub').textContent = subtitle;
      if (hint !== undefined) taskNode('taskHint').textContent = hint;
      badge.className = `task-badge is-${tone}`;
      badge.textContent = '';
      badge.append(icon(tone === 'done' ? 'check' : 'alert'));
      if (hideBtn) hideBtn.hidden = true;

      if (taskView.hidden) {
        // Selesai saat panel disembunyikan: tutup saja; toast hasil sudah tampil.
        closeTask();
        return;
      }

      closeBtn.hidden = false;
      if (autoClose && tone === 'done') {
        taskView.autoClose = setTimeout(closeTask, 4200);
      }
    }
  };

  return api;
}

function newProgressId() {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function pollTaskProgress(task, progressId, onItem) {
  let stopped = false;
  const timer = setInterval(async () => {
    if (stopped || taskView.finished || !taskView.active) return;
    try {
      const response = await fetch(`/api/progress/${encodeURIComponent(progressId)}`);
      const data = await response.json().catch(() => null);
      const progress = data && data.progress;
      if (!progress) return;
      if (progress.phaseText) task.setSubtitle(progress.phaseText);
      task.setProgress(progress.progress, `${fmtNumber(progress.completed)} / ${fmtNumber(progress.total)}`);
      for (const item of progress.items || []) onItem(item, progress);
    } catch {
      /* gangguan jaringan sesaat; coba lagi pada putaran berikutnya */
    }
  }, 320);
  return () => {
    stopped = true;
    clearInterval(timer);
  };
}

/* ----------------------------------------------------------------- modal */

let closeModalHandler = null;

function openModal({ title, subtitle, content, footer }) {
  els.modalRoot.innerHTML = '';
  els.modalRoot.hidden = false;
  document.body.classList.add('no-scroll');

  const close = () => {
    if (!els.modalRoot.hidden) {
      els.modalRoot.innerHTML = '';
      els.modalRoot.hidden = true;
      closeModalHandler = null;
      if (els.drawer.hidden) document.body.classList.remove('no-scroll');
    }
  };

  const dialog = el(
    'div',
    { class: 'modal-card', role: 'dialog', 'aria-modal': 'true' },
    el(
      'div',
      { class: 'modal-head' },
      el('div', {}, el('h3', {}, title), subtitle ? el('p', {}, subtitle) : null),
      el('button', { class: 'icon-btn', type: 'button', 'aria-label': t('Tutup'), onclick: close }, icon('close'))
    ),
    content,
    footer && footer.length ? el('div', { class: 'modal-foot' }, footer) : null
  );

  const backdrop = el('div', { class: 'modal-backdrop' }, dialog);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });
  els.modalRoot.append(backdrop);

  requestAnimationFrame(() => backdrop.classList.add('is-open'));
  closeModalHandler = close;
  return close;
}

function confirmModal({ title, subtitle, message, confirmLabel = t('Lanjutkan'), tone = 'danger' }) {
  return new Promise((resolve) => {
    const content = el('div', { class: 'modal-body' }, el('p', {}, message));
    let close;
    const cancel = el('button', { class: 'btn ghost', type: 'button', onclick: () => close() }, t('Batal'));
    const confirm = el(
      'button',
      { class: `btn ${tone === 'danger' ? 'danger' : 'primary'}`, type: 'button' },
      confirmLabel
    );
    confirm.addEventListener('click', () => {
      close();
      resolve(true);
    });
    close = openModal({ title, subtitle, content, footer: [cancel, confirm] });
    confirm.focus();
  });
}

/* ---------------------------------------------------------------- daftar */

const previewableRank = (group) => (group.hasPreviewable ? 0 : 1);

const SORTS = {
  family: (a, b) => previewableRank(a) - previewableRank(b) || byName(a.family, b.family),
  size: (a, b) => previewableRank(a) - previewableRank(b) || b.totalSize - a.totalSize || byName(a.family, b.family),
  recent: (a, b) => previewableRank(a) - previewableRank(b) || b.modifiedAt - a.modifiedAt || byName(a.family, b.family),
  weight: (a, b) => previewableRank(a) - previewableRank(b) || b.maxWeight - a.maxWeight || byName(a.family, b.family)
};

function matchesView(group, view) {
  if (view === 'system') return group.sources.has('system');
  if (view === 'user') return group.sources.has('user');
  if (view === 'custom') return group.sources.has('custom');
  if (view === 'adobe') return group.sources.has('adobe');
  if (view === 'tracked') return group.anyTracked;
  if (view === 'missing') return group.hasMissing || group.hasOrphan;
  return true;
}

function computeList() {
  const query = norm(state.query).trim();
  const tokens = query.split(/\s+/).filter(Boolean);
  const key = [state.view, query, state.sort, state.fontsVersion, state.trackVersion].join('|');
  if (key === state.filterKey) return state.list;

  let list = state.families.filter(
    (group) => matchesView(group, state.view) && tokens.every((token) => group.searchText.includes(token))
  );
  list.sort(SORTS[state.sort] || SORTS.family);

  state.list = list;
  state.filterKey = key;
  return list;
}

function render() {
  els.openBackupFolder.hidden = state.view !== 'backups';
  if (state.view === 'backups') {
    renderBackups();
    return;
  }

  const view = VIEWS[state.view] || VIEWS.all;
  els.viewTitle.textContent = t(view.title);
  els.viewSub.textContent = t(view.sub);
  els.grid.className = 'grid';
  els.grid.innerHTML = '';
  els.sentinel.hidden = true;
  state.rendered = 0;
  previewObserver.disconnect();
  sentinelObserver.disconnect();

  const list = computeList();
  if (!list.length) {
    els.viewInfo.textContent = t('0 keluarga');
    renderEmpty();
    updateSelectionUI();
    return;
  }

  hideEmpty();
  appendBatch();

  const fileCount = list.reduce((sum, group) => sum + group.files.length, 0);
  const totalSize = list.reduce((sum, group) => sum + group.totalSize, 0);
  els.viewInfo.textContent = tp('{families} keluarga · {files} berkas · {size}', {
    families: fmtNumber(list.length),
    files: fmtNumber(fileCount),
    size: fmtBytes(totalSize)
  });
  updateSelectionUI();
}

function appendBatch() {
  if (state.view === 'backups') return;
  const list = computeList();
  if (state.rendered >= list.length) {
    els.sentinel.hidden = true;
    return;
  }

  const slice = list.slice(state.rendered, state.rendered + PAGE_SIZE);
  const fragment = document.createDocumentFragment();
  for (const group of slice) fragment.append(createCard(group));
  els.grid.append(fragment);
  state.rendered += slice.length;
  updateSelectionUI();

  if (state.rendered < list.length) {
    els.sentinel.hidden = false;
    if (els.loadMore) {
      els.loadMore.textContent = tp('Muat lebih banyak — {count} keluarga tersisa', {
        count: fmtNumber(list.length - state.rendered)
      });
    }
    sentinelObserver.observe(els.sentinel);
    requestAnimationFrame(() => {
      if (els.sentinel.getBoundingClientRect().top < window.innerHeight + 500) appendBatch();
    });
  } else {
    els.sentinel.hidden = true;
    sentinelObserver.disconnect();
  }
}

function renderEmpty() {
  const query = state.query.trim();
  if (query) {
    showEmpty(
      tp('Tidak ada hasil untuk “{query}”', { query }),
      t('Coba kata kunci lain, atau hapus filter pencarian.'),
      t('Hapus pencarian'),
      () => {
        els.search.value = '';
        state.query = '';
        render();
      }
    );
    return;
  }

  if (state.view === 'tracked') {
    showEmpty(
      t('Belum ada keluarga dilacak'),
      t('Tekan ikon bintang pada kartu font untuk menandai seluruh keluarga dan memantaunya dari sini.'),
      null,
      null
    );
    return;
  }
  if (state.view === 'missing') {
    showEmpty(t('Tidak ada entri bermasalah'), t('Semua berkas font dan entri registri dalam kondisi baik.'), null, null);
    return;
  }
  if (state.view === 'custom') {
    showEmpty(t('Tidak ada font kustom'), t('Font di luar folder font Windows akan muncul di sini.'), null, null);
    return;
  }
  if (state.view === 'adobe') {
    showEmpty(
      t('Tidak ada font Adobe'),
      t('Font langganan Adobe Fonts yang aktif di Creative Cloud akan muncul di sini.'),
      null,
      null
    );
    return;
  }
  if (state.view === 'system' || state.view === 'user') {
    showEmpty(
      tp('Tidak ada {kind}', {
        kind: t(state.view === 'system' ? 'font sistem' : 'font pengguna')
      }),
      t('Coba pindai ulang untuk memperbarui daftar font.'),
      t('Pindai ulang'),
      () => loadFonts(true)
    );
    return;
  }
  showEmpty(
    t('Tidak ada font terdeteksi'),
    t('Aplikasi tidak menemukan berkas font di folder Windows. Coba pindai ulang.'),
    t('Pindai ulang'),
    () => loadFonts(true)
  );
}

function showEmpty(title, text, actionLabel, action) {
  els.emptyTitle.textContent = title;
  els.emptyText.textContent = text;
  if (actionLabel && action) {
    els.emptyAction.hidden = false;
    els.emptyAction.textContent = actionLabel;
    els.emptyAction.onclick = action;
  } else {
    els.emptyAction.hidden = true;
    els.emptyAction.onclick = null;
  }
  els.empty.hidden = false;
}

function hideEmpty() {
  els.empty.hidden = true;
}

function renderSkeleton() {
  els.grid.className = 'grid';
  els.grid.innerHTML = '';
  els.sentinel.hidden = true;
  hideEmpty();
  for (let i = 0; i < 6; i++) {
    els.grid.append(
      el(
        'div',
        { class: 'card skeleton' },
        el('div', { class: 'sk sk-preview' }),
        el('div', { class: 'sk sk-line' }),
        el('div', { class: 'sk sk-line short' }),
        el('div', { class: 'sk sk-chips' }, el('div', { class: 'sk sk-chip' }), el('div', { class: 'sk sk-chip' }))
      )
    );
  }
}

/* ---------------------------------------------------------------- pilihan */

function selectedGroups() {
  return Array.from(state.selected)
    .map((key) => state.familyByKey.get(key))
    .filter(Boolean);
}

function selectionTotals(groups = selectedGroups()) {
  let files = 0;
  let size = 0;
  let protectedGroups = 0;

  for (const group of groups) {
    files += group.files.length;
    size += group.totalSize;
    if (group.hasProtected) protectedGroups++;
  }

  return { families: groups.length, files, size, protectedGroups };
}

function addGroupToSelection(group) {
  if (!group || state.selected.has(group.key)) return true;
  if (selectionTotals().files + group.files.length > MAX_SELECTION_FILES) return false;
  state.selected.add(group.key);
  return true;
}

function toggleGroupSelection(group) {
  if (!state.selectMode) return;

  if (state.selected.has(group.key)) {
    state.selected.delete(group.key);
  } else if (!addGroupToSelection(group)) {
    toast(
      'warn',
      tp('Batas {count} berkas per operasi. Hapus pilihan saat ini dulu.', {
        count: fmtNumber(MAX_SELECTION_FILES)
      }),
      { timeout: 6500 }
    );
    return;
  }

  updateSelectionUI();
}

function selectGroups(groups) {
  const list = (groups || []).filter(Boolean);
  let files = selectionTotals().files;
  let added = 0;
  let protectedSkipped = 0;
  let limitSkipped = 0;

  for (const group of list) {
    if (state.selected.has(group.key)) continue;
    if (group.hasProtected) {
      protectedSkipped++;
      continue;
    }
    if (files + group.files.length > MAX_SELECTION_FILES) {
      limitSkipped++;
      continue;
    }
    state.selected.add(group.key);
    files += group.files.length;
    added++;
  }

  updateSelectionUI();

  const parts = [];
  if (added) parts.push(tp('{count} keluarga ditambahkan', { count: fmtNumber(added) }));
  else parts.push(t('Tidak ada keluarga baru yang dipilih'));
  if (protectedSkipped) {
    parts.push(tp('{count} keluarga inti sistem dilewati', { count: fmtNumber(protectedSkipped) }));
  }
  if (limitSkipped) {
    parts.push(tp('batas {count} berkas tercapai', { count: fmtNumber(MAX_SELECTION_FILES) }));
  }
  toast(added ? 'success' : 'warn', parts.join(' · '), { timeout: 7000 });
}

function selectVisibleGroups() {
  const groups = $$('.card', els.grid)
    .map((card) => state.familyByKey.get(card.dataset.familyKey))
    .filter(Boolean);
  selectGroups(groups);
}

function selectAllResults() {
  const list = computeList();
  if (!list.length) {
    toast('warn', t('Tidak ada hasil untuk dipilih.'));
    return;
  }
  selectGroups(list);
}

function clearSelection() {
  if (!state.selected.size) return;
  state.selected.clear();
  updateSelectionUI();
}

function setSelectMode(enabled) {
  const next = !!enabled;
  if (next === state.selectMode) return;
  state.selectMode = next;
  if (!next) state.selected.clear();
  updateSelectionUI();
}

function updateSelectionUI() {
  const active = state.selectMode && state.view !== 'backups';
  document.body.classList.toggle('is-selecting', active);

  if (els.selectionBar) els.selectionBar.hidden = !active;
  if (els.select) {
    els.select.disabled = state.view === 'backups';
    els.select.classList.toggle('is-active', active);
    const label = els.select.querySelector('.btn-label');
    if (label) label.textContent = active ? t('Selesai') : t('Pilih');
    els.select.title = active
      ? t('Selesai memilih')
      : t('Pilih beberapa keluarga font untuk dihapus');
  }

  const totals = selectionTotals();
  if (els.selectionCount) {
    els.selectionCount.textContent = tp('{count} keluarga', { count: fmtNumber(totals.families) });
  }
  if (els.selectionMeta) {
    els.selectionMeta.textContent = totals.families
      ? tp('{count} berkas · {size}', {
          count: fmtNumber(totals.files),
          size: fmtBytes(totals.size)
        }) +
        (totals.protectedGroups
          ? ' ' + tp('· {count} inti sistem', { count: fmtNumber(totals.protectedGroups) })
          : '')
      : t('Pilih keluarga yang akan dihapus');
  }
  if (els.deleteSelected) {
    els.deleteSelected.disabled = totals.families === 0;
    els.deleteSelected.textContent = totals.families
      ? tp('Hapus {count} berkas', { count: fmtNumber(totals.files) })
      : t('Hapus terpilih');
  }
  if (els.backupSelected) {
    const backupable = selectedGroups()
      .flatMap((group) => group.files)
      .filter((font) => font.exists).length;
    els.backupSelected.disabled = backupable === 0;
    els.backupSelected.textContent = backupable
      ? tp('Cadangkan {count} berkas', { count: fmtNumber(backupable) })
      : t('Cadangkan terpilih');
  }
  if (els.clearSelection) els.clearSelection.disabled = totals.families === 0;

  const listCount = state.view === 'backups' ? 0 : state.list.length;
  if (els.selectAll) {
    els.selectAll.disabled = !active || listCount === 0;
    els.selectAll.textContent = tp('Pilih semua hasil ({count})', { count: fmtNumber(listCount) });
    els.selectAll.title = tp('Pilih semua hasil; maksimal {count} berkas per operasi', {
      count: fmtNumber(MAX_SELECTION_FILES)
    });
  }
  if (els.selectVisible) {
    els.selectVisible.disabled = !active || state.rendered === 0;
    els.selectVisible.textContent = tp('Pilih tampil ({count})', { count: fmtNumber(state.rendered) });
    els.selectVisible.title = tp('Pilih keluarga yang sedang tampil; maksimal {count} berkas', {
      count: fmtNumber(MAX_SELECTION_FILES)
    });
    els.selectVisible.hidden = state.rendered >= listCount;
  }

  for (const card of $$('.card', els.grid)) {
    if (card.classList.contains('skeleton')) continue;
    const key = card.dataset.familyKey;
    const selected = active && state.selected.has(key);
    card.classList.toggle('is-selected', selected);
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
    const toggle = card.querySelector('.select-toggle');
    if (toggle) toggle.setAttribute('aria-checked', selected ? 'true' : 'false');
  }
}

/* ------------------------------------------------------------------ kartu */

function createCard(group) {
  const primary = group.primary;
  const card = el('article', {
    class: 'card',
    role: 'button',
    tabindex: '0',
    'aria-label': tp('Keluarga {name} — {count} berkas', { name: group.family, count: group.files.length })
  });
  card.dataset.familyKey = group.key;
  card.dataset.id = primary.id;
  if (group.hasProtected) card.classList.add('is-protected');

  const previewLabel = previewText(group);
  const sample = el('span', { class: 'sample' }, previewLabel);
  styleCardSample(sample, previewLabel);

  const star = el('button', { class: 'star-btn', type: 'button' });
  setFamilyStar(star, group);
  star.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFamilyTrack(group);
  });

  const selectToggle = el(
    'button',
    {
      class: 'select-toggle',
      type: 'button',
      role: 'checkbox',
      'aria-checked': state.selected.has(group.key) ? 'true' : 'false',
      'aria-label': tp('Pilih {name} untuk dihapus', { name: group.family }),
      title: t('Tandai untuk dihapus')
    },
    icon('check')
  );
  selectToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleGroupSelection(group);
  });

  const preview = el('div', { class: 'card-preview' }, sample, star, selectToggle);

  const info = el('div', { class: 'card-info' });
  info.append(
    el(
      'div',
      { class: 'card-title-row' },
      el('h3', { class: 'card-family', title: group.family }, group.family),
      el(
        'span',
        { class: 'card-style' },
        group.files.length > 1 ? tp('{count} gaya', { count: group.files.length }) : styleLabel(primary, group)
      )
    )
  );

  if (group.files.length > 1) {
    info.append(el('p', { class: 'card-styles', title: styleSummary(group) }, styleSummary(group)));
  }

  const missingCount = group.files.filter((font) => !font.exists && !font.trackedOnly).length;
  info.append(
    el(
      'p',
      { class: 'card-file', title: primary.fileName },
      group.files.length > 1
        ? tp('{name} +{count} berkas', { name: primary.fileName, count: group.files.length - 1 })
        : primary.fileName
    )
  );

  const chips = el('div', { class: 'chips' });
  for (const source of ['system', 'user', 'custom', 'adobe']) {
    if (group.sources.has(source)) chips.append(el('span', { class: `chip ${source}` }, t(SOURCE_LABELS[source])));
  }
  const untracked = group.files.filter((font) => font.trackedOnly).length;
  if (untracked) chips.append(el('span', { class: 'chip warn' }, tp('{count} tidak terdeteksi', { count: untracked })));
  if (group.files.length > 1) {
    chips.append(el('span', { class: 'chip' }, tp('{count} berkas', { count: group.files.length })));
  }
  if (group.totalSize) chips.append(el('span', { class: 'chip' }, fmtBytes(group.totalSize)));
  if (group.hasVariable) chips.append(el('span', { class: 'chip var' }, t('Variabel')));
  if (group.hasCollection) chips.append(el('span', { class: 'chip' }, t('Koleksi')));
  if (group.hasProtected) chips.append(el('span', { class: 'chip warn' }, t('Inti sistem')));
  if (missingCount) chips.append(el('span', { class: 'chip danger' }, tp('{count} hilang', { count: missingCount })));
  else if (group.hasOrphan) chips.append(el('span', { class: 'chip warn' }, t('Belum terdaftar')));
  info.append(chips);

  const detailBtn = el('button', { class: 'btn-mini', type: 'button', title: t('Lihat semua gaya') }, icon('info'), t('Detail'));
  detailBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    openFamilyDrawer(group);
  });

  const revealBtn = el('button', { class: 'btn-mini', type: 'button', title: t('Buka folder font') }, icon('folder'), t('Folder'));
  revealBtn.disabled = !primary.exists;
  revealBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    revealFont(primary, revealBtn);
  });

  const deleteBtn = el('button', { class: 'btn-mini is-danger', type: 'button', title: t('Hapus keluarga font') }, icon('trash'), t('Hapus'));
  deleteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    confirmDeleteFamily(group);
  });

  // Keluarga yang seluruh berkasnya tidak terdeteksi tidak punya apa pun
  // untuk dihapus; arahkan pengguna menghentikan pelacakan saja.
  const onlyTracked = group.files.every((font) => font.trackedOnly);
  if (onlyTracked) {
    deleteBtn.disabled = true;
    deleteBtn.title = t('Berkas tidak terdeteksi — hentikan pelacakan dari kartu ini');
  }
  const untrackBtn = onlyTracked
    ? el('button', { class: 'btn-mini', type: 'button', title: t('Hentikan pelacakan keluarga ini') }, icon('star'), t('Lepas'))
    : null;
  if (untrackBtn) {
    untrackBtn.addEventListener('click', async (event) => {
      event.stopPropagation();
      await toggleFamilyTrack(group);
    });
  }

  info.append(el('div', { class: 'card-actions' }, detailBtn, revealBtn, deleteBtn, untrackBtn));
  card.append(preview, info);

  if (primary.previewable && primary.exists) {
    card.classList.add('is-pending');
    previewObserver.observe(card);
  } else {
    card.classList.add('is-static');
    sample.textContent = t(NO_PREVIEW_LABEL);
  }

  card.addEventListener('click', () => {
    if (state.selectMode) {
      toggleGroupSelection(group);
      return;
    }
    openFamilyDrawer(group);
  });
  card.addEventListener('keydown', (event) => {
    if (event.target !== card) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (state.selectMode) toggleGroupSelection(group);
      else openFamilyDrawer(group);
    }
  });

  return card;
}

function updateSamples() {
  for (const card of $$('.card', els.grid)) {
    if (card.classList.contains('skeleton')) continue;
    const group = state.familyByKey.get(card.dataset.familyKey);
    if (!group) continue;
    const sample = card.querySelector('.sample');
    if (!sample) continue;
    const text = card.classList.contains('is-static')
      ? t(NO_PREVIEW_LABEL)
      : previewText(group);
    sample.textContent = text;
    styleCardSample(sample, text);
  }

  const entity = state.activeFamilyKey
    ? state.familyByKey.get(state.activeFamilyKey)
    : state.detail || (state.activeFontId ? state.fontById.get(state.activeFontId) : null);
  if (entity) {
    const text = previewText(entity);
    const panel = els.drawer.querySelector('.drawer-preview');
    if (panel && panel.classList.contains('is-fallback')) {
      for (const line of state.drawerLines) line.textContent = text;
    } else {
      stylePreviewLines(state.drawerLines, text);
    }
  }
}

/* ----------------------------------------------------------------- drawer */

function updateScrollLock() {
  document.body.classList.toggle('no-scroll', !els.drawer.hidden || !els.modalRoot.hidden);
}

function showDrawer(node) {
  els.drawer.innerHTML = '';
  els.drawer.append(node);
  els.drawer.hidden = false;
  els.overlay.hidden = false;
  els.drawer.scrollTop = 0;
  requestAnimationFrame(() => {
    els.drawer.classList.add('is-open');
    els.overlay.classList.add('is-open');
  });
  updateScrollLock();
}

function closeDrawer() {
  if (els.drawer.hidden) {
    updateScrollLock();
    return;
  }
  els.drawer.classList.remove('is-open');
  els.overlay.classList.remove('is-open');
  state.activeFontId = null;
  state.activeFamilyKey = null;
  state.fileBackKey = null;
  state.familyPreviewId = null;
  state.detail = null;
  state.drawerLines = [];
  state.trackBtn = null;
  state.familyTrackBtn = null;
  updateScrollLock();

  setTimeout(() => {
    if (els.drawer.classList.contains('is-open')) return;
    els.drawer.hidden = true;
    els.overlay.hidden = true;
    els.drawer.innerHTML = '';
    // Kunci scroll hanya boleh aktif selama drawer/modal benar-benar terbuka.
    updateScrollLock();
  }, 300);
}

function drawerCloseButton() {
  return el(
    'button',
    { class: 'icon-btn', type: 'button', 'aria-label': t('Tutup detail'), onclick: closeDrawer },
    icon('close')
  );
}

function openFamilyDrawer(group) {
  state.activeFontId = null;
  state.activeFamilyKey = group.key;
  state.fileBackKey = null;
  state.detail = null;
  state.familyPreviewId = group.primary ? group.primary.id : null;
  state.trackBtn = null;
  state.familyTrackBtn = null;
  state.drawerLines = [];

  showDrawer(buildFamilyDrawer(group));
  loadFamilyPreview(group);
}

function buildFamilyDrawer(group) {
  const files = group.files;
  const previewables = files.filter((font) => font.exists && font.previewable);
  const missingCount = files.filter((font) => !font.exists && !font.trackedOnly).length;

  const eyebrow = el('div', { class: 'drawer-eyebrow' });
  for (const source of ['system', 'user', 'custom', 'adobe']) {
    if (group.sources.has(source)) eyebrow.append(el('span', { class: `chip ${source}` }, t(SOURCE_LABELS[source])));
  }
  for (const format of group.formats) eyebrow.append(el('span', { class: 'chip' }, format));
  eyebrow.append(el('span', { class: 'chip' }, tp('{count} berkas', { count: files.length })));

  const header = el(
    'div',
    { class: 'drawer-head' },
    el(
      'div',
      {},
      eyebrow,
      el('h2', {}, group.family),
      el('p', {}, `${files.length} berkas · ${fmtBytes(group.totalSize)}`)
    ),
    drawerCloseButton()
  );

  const body = el('div', { class: 'drawer-body' });

  const lineText = previewText(group);
  const lineSmall = el('div', { class: 'line is-small' }, lineText);
  const lineMid = el('div', { class: 'line is-mid' }, lineText);
  const lineBig = el('div', { class: 'line is-big' }, lineText);
  for (const [line, max] of [[lineSmall, 18], [lineMid, 32], [lineBig, 52]]) line.dataset.max = String(max);
  state.drawerLines = [lineSmall, lineMid, lineBig];
  stylePreviewLines(state.drawerLines, lineText);
  const note = el('div', { class: 'preview-note' }, t('Pratinjau nama font'));
  body.append(el('div', { class: 'drawer-preview' }, lineSmall, lineMid, lineBig, note));

  if (previewables.length > 1) {
    const byLabel = new Map();
    for (const font of previewables) {
      const label = styleLabel(font, group);
      const entry = byLabel.get(label) || { label, font, files: [] };
      entry.files.push(font);
      if (font.id === state.familyPreviewId) entry.font = font;
      byLabel.set(label, entry);
    }
    const styleEntries = Array.from(byLabel.values());

    if (styleEntries.length > 1) {
      const pills = el('div', { class: 'style-pills' });
      for (const entry of styleEntries) {
        const font = entry.font;
        const pill = el(
          'button',
          {
            class: 'style-pill' + (font.id === state.familyPreviewId ? ' is-active' : ''),
            type: 'button',
            title: entry.files.map((item) => item.fileName).join(' · '),
            dataset: { id: font.id }
          },
          entry.label
        );
        pill.addEventListener('click', () => selectFamilyPreview(group, font.id));
        pills.append(pill);
      }
      body.append(
        el(
          'div',
          { class: 'drawer-section' },
          el('h4', {}, tp('Pilih gaya untuk pratinjau ({count})', { count: styleEntries.length })),
          pills
        )
      );
    }
  }

  const trackBtn = el('button', { class: `btn ${group.allTracked ? 'primary' : 'ghost'}`, type: 'button' }, icon('star'), group.allTracked ? t('Dilacak') : t('Lacak keluarga'));
  trackBtn.addEventListener('click', () => toggleFamilyTrack(group));
  state.familyTrackBtn = trackBtn;

  const actions = el('div', { class: 'drawer-actions' }, trackBtn);

  const revealBtn = el('button', { class: 'btn ghost', type: 'button' }, icon('folder'), t('Buka folder'));
  revealBtn.disabled = !group.primary.exists;
  revealBtn.addEventListener('click', () => revealFont(group.primary, revealBtn));
  actions.append(revealBtn);

  const deleteBtn = el('button', { class: 'btn ghost', type: 'button' }, icon('trash'), t('Hapus keluarga'));
  deleteBtn.addEventListener('click', () => confirmDeleteFamily(group));
  actions.append(deleteBtn);

  // Cadangan khusus untuk famili font langganan: berkasnya bisa hilang
  // begitu langganan Creative Cloud berakhir, jadi salinan mandiri berguna.
  if (group.sources.has('adobe')) {
    const familyBackupBtn = el(
      'button',
      { class: 'btn ghost', type: 'button', title: t('Cadangkan semua berkas Adobe Fonts dalam famili ini') },
      icon('archive'),
      t('Cadangkan')
    );
    familyBackupBtn.disabled = !group.files.some((font) => font.exists);
    familyBackupBtn.addEventListener('click', () =>
      backupFonts(
        group.files.filter((font) => font.exists),
        familyBackupBtn
      )
    );
    actions.append(familyBackupBtn);
  }

  body.append(actions);

  if (group.hasProtected) {
    body.append(
      el(
        'div',
        { class: 'notice danger' },
        icon('alert'),
        el('div', {}, t('Keluarga ini berisi font inti Windows. Menghapusnya dapat membuat antarmuka Windows tidak terbaca.'))
      )
    );
  }
  if (missingCount) {
    body.append(
      el(
        'div',
        { class: 'notice' },
        icon('alert'),
        el('div', {}, `${missingCount} berkas dalam keluarga ini hilang dari disk. Entri registrinya masih dapat dibersihkan.`)
      )
    );
  }
  if (group.hasOrphan) {
    body.append(
      el(
        'div',
        { class: 'notice' },
        icon('info'),
        el('div', {}, t('Sebagian berkas ada di folder font tetapi belum terdaftar di registri Windows.'))
      )
    );
  }

  const allMissing = missingCount === files.length;
  const infoRows = [
    [t('Keluarga'), group.family],
    [t('Jumlah berkas'), tp('{count} berkas', { count: files.length })],
    [t('Gaya'), Array.from(group.styles).join(', ') || '—'],
    [t('Total ukuran'), fmtBytes(group.totalSize)],
    [t('Sumber'), Array.from(group.sources).map((source) => t(SOURCE_LABELS[source]) || source).join(' + ')],
    [t('Format'), Array.from(group.formats).join(', ') || '—'],
    [
      t('Status'),
      allMissing
        ? t('Semua berkas hilang')
        : missingCount
          ? `${missingCount} berkas hilang`
          : t('Semua berkas tersedia')
    ]
  ];

  const adobeUrl = (group.files.find((font) => font.adobeUrl) || {}).adobeUrl;
  if (adobeUrl) {
    infoRows.push([
      t('Tautan'),
      el(
        'a',
        { class: 'adobe-link', href: adobeUrl, target: '_blank', rel: 'noreferrer noopener', onclick: (event) => event.stopPropagation() },
        t('Lihat di fonts.adobe.com')
      )
    ]);
  }

  const info = el('div', { class: 'drawer-section' }, el('h4', {}, t('Informasi keluarga')));
  const dl = el('dl', { class: 'kv' });
  for (const [label, value] of infoRows) dl.append(el('dt', {}, label), el('dd', {}, value));
  info.append(dl);
  body.append(info);

  const listSection = el('div', { class: 'drawer-section' }, el('h4', {}, tp('Berkas dalam keluarga ({count})', { count: files.length })));
  const list = el('div', { class: 'family-files' });

  for (const font of files) {
    const label = styleLabel(font, group);
    const detailBtn = el(
      'button',
      { class: 'btn-mini', type: 'button', title: t('Lihat detail berkas'), 'aria-label': tp('Detail {name}', { name: font.fileName }) },
      icon('info')
    );
    detailBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      openDrawer(font, { backToFamily: group.key });
    });

    const revealBtnRow = el(
      'button',
      { class: 'btn-mini', type: 'button', title: t('Buka folder font'), 'aria-label': tp('Buka folder {name}', { name: font.fileName }) },
      icon('folder')
    );
    revealBtnRow.disabled = !font.exists;
    revealBtnRow.addEventListener('click', (event) => {
      event.stopPropagation();
      revealFont(font, revealBtnRow);
    });

    const deleteBtnRow = el(
      'button',
      { class: 'btn-mini is-danger', type: 'button', title: t('Hapus berkas ini'), 'aria-label': tp('Hapus {name}', { name: font.fileName }) },
      icon('trash')
    );
    deleteBtnRow.addEventListener('click', (event) => {
      event.stopPropagation();
      confirmDelete(font);
    });

    const meta = [
      t(SOURCE_LABELS[font.source]) || font.source,
      fmtBytes(font.size),
      font.exists ? null : t('hilang'),
      font.protected ? t('inti sistem') : null,
      font.isVariable ? t('variabel') : null
    ]
      .filter(Boolean)
      .join(' · ');

    const row = el(
      'div',
      { class: 'family-file', role: 'button', tabindex: '0' },
      el(
        'div',
        { class: 'family-file-main' },
        el('strong', {}, label),
        el('span', { class: 'mono' }, font.fileName),
        el('span', { class: 'family-file-meta' }, meta)
      ),
      el('div', { class: 'family-file-actions' }, detailBtn, revealBtnRow, deleteBtnRow)
    );
    row.addEventListener('click', () => openDrawer(font, { backToFamily: group.key }));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDrawer(font, { backToFamily: group.key });
      }
    });
    list.append(row);
  }

  listSection.append(list);
  body.append(listSection);

  return el('div', {}, header, body);
}

function loadFamilyPreview(group) {
  const panel = els.drawer.querySelector('.drawer-preview');
  if (!panel) return;
  const font = state.fontById.get(state.familyPreviewId) || group.primary;
  if (!font) return;
  state.familyPreviewId = font.id;

  const note = panel.querySelector('.preview-note');
  const lines = state.drawerLines;
  for (const line of lines) line.style.fontFamily = '';
  stylePreviewLines(lines, previewText(group));
  panel.classList.remove('is-loaded');
  const fallback = !font.exists || !font.previewable;
  panel.classList.toggle('is-fallback', fallback);

  if (fallback) {
    for (const line of lines) {
      line.style.fontFamily = 'var(--ui-font)';
      line.style.fontSize = '13px';
      line.style.opacity = '1';
    }
    if (note) note.textContent = t('Berkas font ini tidak tersedia untuk pratinjau.');
    panel.classList.add('is-loaded');
    return;
  }

  if (note) {
    note.textContent = tp('Pratinjau {style} · {file}', {
      style: styleLabel(font, group),
      file: font.fileName
    });
  }

  ensureFace(font.id).then((ok) => {
    if (state.activeFamilyKey !== group.key || state.familyPreviewId !== font.id) return;
    panel.classList.add('is-loaded');
    if (ok) {
      for (const line of lines) line.style.fontFamily = `fm-${font.id}`;
    } else if (note) {
      note.textContent = t('Browser tidak dapat memuat pratinjau berkas font ini.');
    }
  });
}

function selectFamilyPreview(group, id) {
  state.familyPreviewId = id;
  for (const pill of $$('.style-pill', els.drawer)) {
    pill.classList.toggle('is-active', pill.dataset.id === id);
  }
  loadFamilyPreview(group);
}

function openDrawer(font, options = {}) {
  state.activeFamilyKey = null;
  state.activeFontId = font.id;
  state.fileBackKey = options.backToFamily || null;
  state.detail = null;
  state.familyPreviewId = null;
  state.trackBtn = null;
  state.familyTrackBtn = null;
  state.drawerLines = [];

  showDrawer(buildDrawer(font, true, { backToFamily: state.fileBackKey }));
  loadDrawerPreview(font);
  updateSamples();

  api(`/api/fonts/${font.id}`)
    .then(({ data }) => {
      if (state.activeFontId !== font.id) return;
      const detail = (data && (data.font || data)) || null;
      if (!detail || !detail.id) return;
      state.detail = detail;
      Object.assign(font, detail);
      if (state.activeFontId !== font.id) return;
      showDrawer(buildDrawer(font, false, { backToFamily: state.fileBackKey }));
      loadDrawerPreview(font);
      updateSamples();
    })
    .catch(() => {
      /* detail registri opsional */
    });
}

function buildDrawer(font, loading, options = {}) {
  const group = state.familyByKey.get(groupKeyFor(font));
  const label = fontLabel(font);
  const fileStyle = styleLabel(font, group);

  const backButton = options.backToFamily
    ? el(
        'button',
        {
          class: 'icon-btn',
          type: 'button',
          title: t('Kembali ke keluarga'),
          'aria-label': t('Kembali ke keluarga'),
          onclick: () => {
            const group = state.familyByKey.get(options.backToFamily);
            if (group) openFamilyDrawer(group);
            else closeDrawer();
          }
        },
        icon('arrowLeft')
      )
    : null;

  const header = el(
    'div',
    { class: 'drawer-head' },
    el(
      'div',
      { class: 'drawer-head-main' },
      backButton,
      el(
        'div',
        { style: { minWidth: '0' } },
        el(
          'div',
          { class: 'drawer-eyebrow' },
          el('span', { class: `chip ${font.source}` }, font.sourceLabel || t(SOURCE_LABELS[font.source]) || font.source),
          el('span', { class: 'chip' }, font.format),
          fileStyle && fileStyle !== t('Regular') ? el('span', { class: 'chip' }, fileStyle) : null,
          font.protected ? el('span', { class: 'chip warn' }, t('Inti sistem')) : null,
          !font.exists ? el('span', { class: 'chip danger' }, t('Berkas hilang')) : null
        ),
        el('h2', {}, label),
        el('p', {}, font.fileName)
      )
    ),
    drawerCloseButton()
  );

  const body = el('div', { class: 'drawer-body' });

  const lineText = previewText(font);
  const lineSmall = el('div', { class: 'line is-small' }, lineText);
  const lineMid = el('div', { class: 'line is-mid' }, lineText);
  const lineBig = el('div', { class: 'line is-big' }, lineText);
  for (const [line, max] of [[lineSmall, 18], [lineMid, 32], [lineBig, 52]]) line.dataset.max = String(max);
  stylePreviewLines([lineSmall, lineMid, lineBig], lineText);
  const note = el(
    'div',
    { class: 'preview-note' },
    font.previewable ? tp('Pratinjau {style}', { style: fileStyle }) : t('Berkas ini tidak dapat dipratinjau.')
  );
  state.drawerLines = [lineSmall, lineMid, lineBig];
  body.append(el('div', { class: 'drawer-preview' }, lineSmall, lineMid, lineBig, note));

  const tracked = isTracked(font.id);
  const trackBtn = el(
    'button',
    { class: `btn ${tracked ? 'primary' : 'ghost'}`, type: 'button' },
    icon('star'),
    tracked ? t('Dilacak') : t('Lacak font')
  );
  trackBtn.addEventListener('click', () => toggleTrack(font, trackBtn));
  state.trackBtn = trackBtn;

  const revealBtn = el('button', { class: 'btn ghost', type: 'button' }, icon('folder'), t('Buka folder'));
  revealBtn.disabled = !font.exists;
  revealBtn.addEventListener('click', () => revealFont(font, revealBtn));

  const backupBtn = el('button', { class: 'btn ghost', type: 'button', title: t('Simpan salinan cadangan font ini') }, icon('archive'), t('Cadangkan'));
  backupBtn.disabled = !font.exists;
  backupBtn.addEventListener('click', () => backupFonts([font], backupBtn));

  const deleteBtn = el('button', { class: 'btn ghost', type: 'button' }, icon('trash'), t('Hapus berkas'));
  deleteBtn.addEventListener('click', () => confirmDelete(font));

  body.append(el('div', { class: 'drawer-actions' }, trackBtn, revealBtn, backupBtn, deleteBtn));

  if (font.protected) {
    body.append(
      el(
        'div',
        { class: 'notice danger' },
        icon('alert'),
        el('div', {}, t('Font ini termasuk font inti Windows. Menghapusnya dapat membuat antarmuka Windows tidak terbaca.'))
      )
    );
  }
  if (font.source === 'adobe') {
    body.append(
      el(
        'div',
        { class: 'notice' },
        icon('alert'),
        el(
          'div',
          {},
          t('Font langganan Adobe Fonts. Menghapus berkas ini mencabut aktivasi lokalnya; aktivasi kembali lewat aplikasi Creative Cloud.')
        )
      )
    );
  }
  if (!font.exists) {
    body.append(
      el(
        'div',
        { class: 'notice' },
        icon('alert'),
        el('div', {}, t('Berkas font tidak ditemukan. Anda masih dapat membersihkan entri registrinya.'))
      )
    );
  }

  const infoRows = [
    [t('Nama lengkap'), label],
    [t('Gaya'), fileStyle || '—'],
    [t('Berat'), `${font.weightName || '—'} (${font.weightClass || '—'})`],
    [t('Jenis berkas'), font.format],
    [t('Ukuran'), fmtBytes(font.size)],
    [t('Diubah'), fmtDateTime(font.modifiedAt)],
    [t('Sumber'), font.sourceLabel || t(SOURCE_LABELS[font.source]) || font.source],
    [t('Hak sematan'), font.embedding || t('Tidak diketahui')],
    [
      t('Status'),
      font.trackedOnly
        ? t('Tidak terdeteksi saat pindai terakhir')
        : font.exists
          ? font.source === 'adobe'
            ? t('Aktif via Adobe Creative Cloud')
            : font.registered
              ? t('Terdaftar di registri')
              : t('Tidak terdaftar')
          : t('Berkas hilang')
    ]
  ];
  if (font.isVariable) infoRows.push([t('Variabel'), t('Ya — mendukung beberapa ketebalan')]);
  if (font.isCollection) infoRows.push([t('Wajah dalam koleksi'), `${font.collectionCount} wajah`]);
  if (font.psName) infoRows.push(['Nama PostScript', font.psName]);
  if (font.adobeUrl) {
    infoRows.push([
      t('Tautan'),
      el(
        'a',
        {
          class: 'adobe-link',
          href: font.adobeUrl,
          target: '_blank',
          rel: 'noreferrer noopener',
          onclick: (event) => event.stopPropagation()
        },
        t('Lihat di fonts.adobe.com')
      )
    ]);
  }

  const info = el('div', { class: 'drawer-section' }, el('h4', {}, t('Informasi font')));
  const dl = el('dl', { class: 'kv' });
  for (const [label, value] of infoRows) dl.append(el('dt', {}, label), el('dd', {}, value));
  info.append(dl);
  body.append(info);

  const pathSection = el('div', { class: 'drawer-section' }, el('h4', {}, t('Lokasi berkas')));
  const copyBtn = el(
    'button',
    { class: 'copy-btn', type: 'button', title: t('Salin path'), 'aria-label': t('Salin path') },
    icon('copy')
  );
  copyBtn.addEventListener('click', () => copyToClipboard(font.filePath));
  pathSection.append(el('div', { class: 'path-row' }, el('code', {}, font.filePath), copyBtn));
  body.append(pathSection);

  if (font.faces && font.faces.length > 1) {
    const facesSection = el('div', { class: 'drawer-section' }, el('h4', {}, t('Wajah font dalam berkas')));
    for (const face of font.faces) {
      facesSection.append(
        el(
          'div',
          { class: 'face-row' },
          el('div', {}, face.fullName || [face.family, face.subfamily].filter(Boolean).join(' ')),
          el('span', {}, `${face.weightName}${face.italic ? ' · Miring' : ''}${face.variable ? ' · Variabel' : ''}`)
        )
      );
    }
    body.append(facesSection);
  }

  const registrySection = el('div', { class: 'drawer-section' }, el('h4', {}, t('Entri registri')));
  if (loading) {
    registrySection.append(el('p', { style: { fontSize: '12px', color: 'var(--muted-2)' } }, t('Memuat detail registri…')));
  } else if (Array.isArray(font.registry) && font.registry.length) {
    for (const entry of font.registry) {
      registrySection.append(
        el(
          'div',
          { class: 'registry-item' },
          el('em', {}, entry.root === 'HKLM' ? t('HKLM · semua pengguna') : t('HKCU · akun ini')),
          `${entry.name} = ${entry.value}`
        )
      );
    }
  } else {
    registrySection.append(
      el(
        'p',
        { style: { fontSize: '12px', color: 'var(--muted-2)' } },
        Array.isArray(font.registry)
          ? t('Tidak ada entri registri untuk berkas ini.')
          : t('Detail registri tidak tersedia.')
      )
    );
  }
  body.append(registrySection);

  return el('div', {}, header, body);
}

function loadDrawerPreview(font) {
  if (!font.previewable) return;
  ensureFace(font.id).then((ok) => {
    if (state.activeFontId !== font.id || !state.drawerLines.length) return;
    const panel = els.drawer.querySelector('.drawer-preview');
    if (!panel) return;
    const note = panel.querySelector('.preview-note');
    if (ok) {
      for (const line of state.drawerLines) line.style.fontFamily = `fm-${font.id}`;
      panel.classList.add('is-loaded');
    } else {
      panel.classList.add('is-loaded');
      if (note) note.textContent = t('Browser tidak dapat memuat pratinjau berkas font ini.');
    }
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('success', t('Path disalin ke papan klip.'), { timeout: 2000 });
    return;
  } catch {
    /* fallback di bawah */
  }
  const area = el('textarea', { style: { position: 'fixed', opacity: '0', top: '0' } });
  area.value = text;
  document.body.append(area);
  area.select();
  try {
    document.execCommand('copy');
    toast('success', t('Path disalin ke papan klip.'), { timeout: 2000 });
  } catch {
    toast('error', t('Gagal menyalin path.'));
  }
  area.remove();
}

async function revealFont(font, btn) {
  if (btn) btn.disabled = true;
  try {
    await api(`/api/fonts/${font.id}/reveal`, { method: 'POST' });
    toast('info', t('Folder font dibuka di Explorer.'), { timeout: 2200 });
  } catch (error) {
    toast('error', tp('Gagal membuka folder: {error}', { error: error.message }));
  } finally {
    if (btn && btn.isConnected) btn.disabled = false;
  }
}

/* ---------------------------------------------------------------- lacak */

function isTracked(id) {
  return state.tracked.has(id);
}

function setFamilyStar(btn, group) {
  btn.classList.toggle('is-on', group.allTracked);
  btn.classList.toggle('is-partial', !group.allTracked && group.anyTracked);
  btn.setAttribute('aria-pressed', group.allTracked ? 'true' : 'false');
  btn.title = group.allTracked
    ? t('Hentikan pelacakan keluarga')
    : group.anyTracked
      ? t('Lacak semua gaya dalam keluarga')
      : t('Lacak keluarga');
}

function updateCardStar(card) {
  const group = state.familyByKey.get(card.dataset.familyKey);
  if (!group) return;
  refreshFamilyTracking(group);
  const btn = card.querySelector('.star-btn');
  if (btn) setFamilyStar(btn, group);
}

function paintTrackButton(btn, tracked, idleLabel) {
  if (!btn || !btn.isConnected) return;
  btn.className = `btn ${tracked ? 'primary' : 'ghost'}`;
  btn.innerHTML = '';
  btn.append(icon('star'), tracked ? t('Dilacak') : idleLabel);
}

async function toggleTrack(font, btn) {
  if (state.trackBusy.has(font.id)) return;
  state.trackBusy.add(font.id);
  const tracked = isTracked(font.id);
  if (btn instanceof HTMLElement) btn.disabled = true;

  try {
    await api(`/api/fonts/${font.id}/track`, { method: 'POST', json: { tracked: !tracked } });

    if (tracked) {
      state.tracked.delete(font.id);
      delete state.trackedMeta[font.id];
    } else {
      state.tracked.add(font.id);
      state.trackedMeta[font.id] = {
        id: font.id,
        family: font.family,
        subfamily: font.subfamily,
        fileName: font.fileName,
        filePath: font.filePath
      };
    }
    font.tracked = !tracked;
    state.trackVersion++;

    const group = state.familyByKey.get(groupKeyFor(font));
    if (group) refreshFamilyTracking(group);
    updateStats();
    updateNavCounts();

    if (state.view === 'tracked') {
      render();
    } else {
      for (const card of $$('.card', els.grid)) updateCardStar(card);
    }
    paintTrackButton(btn, !tracked, t('Lacak font'));

    toast(
      'success',
      tracked
        ? tp('Pelacakan {name} dihentikan.', { name: fontLabel(font) })
        : tp('{name} ditambahkan ke daftar dilacak.', { name: fontLabel(font) }),
      { timeout: 2600 }
    );
  } catch (error) {
    toast('error', tp('Gagal memperbarui pelacakan: {error}', { error: error.message }));
  } finally {
    state.trackBusy.delete(font.id);
    if (btn instanceof HTMLElement && btn.isConnected) btn.disabled = false;
  }
}

async function toggleFamilyTrack(group) {
  if (state.familyTrackBusy.has(group.key)) return;
  state.familyTrackBusy.add(group.key);
  const tracked = !group.allTracked;

  try {
    await api('/api/fonts/track-batch', {
      method: 'POST',
      json: {
        ids: group.files.map((font) => font.id),
        items: group.files.map((font) => ({
          id: font.id,
          family: font.family,
          subfamily: font.subfamily,
          fileName: font.fileName,
          filePath: font.filePath
        })),
        tracked
      }
    });

    for (const font of group.files) {
      if (tracked) {
        state.tracked.add(font.id);
        state.trackedMeta[font.id] = {
          id: font.id,
          family: font.family,
          subfamily: font.subfamily,
          fileName: font.fileName,
          filePath: font.filePath
        };
        font.tracked = true;
      } else {
        state.tracked.delete(font.id);
        delete state.trackedMeta[font.id];
        font.tracked = false;
      }
    }
    refreshFamilyTracking(group);
    state.trackVersion++;
    updateStats();
    updateNavCounts();

    if (state.view === 'tracked') {
      render();
    } else {
      for (const card of $$('.card', els.grid)) updateCardStar(card);
    }
    paintTrackButton(state.familyTrackBtn, group.allTracked, t('Lacak keluarga'));

    toast(
      'success',
      tracked
        ? tp('{name} dilacak — {count} berkas gaya sekaligus.', {
            name: group.family,
            count: group.files.length
          })
        : tp('Pelacakan {name} dihentikan.', { name: group.family }),
      { timeout: 3200 }
    );
  } catch (error) {
    toast('error', tp('Gagal memperbarui pelacakan: {error}', { error: error.message }));
  } finally {
    state.familyTrackBusy.delete(group.key);
  }
}

/* ---------------------------------------------------------------- hapus */

function confirmDelete(font) {
  closeDrawer();

  const hasFile = !!font.exists;
  const isProtected = !!font.protected;
  const content = el('div', { class: 'modal-body' });

  content.append(
    el(
      'div',
      { class: 'modal-summary' },
      el('div', { class: 'modal-summary-mark' }, logoMark()),
      el(
        'div',
        {},
        el('strong', {}, fontLabel(font)),
        el('span', {}, `${font.fileName} · ${fmtBytes(font.size)}`)
      )
    )
  );

  if (!hasFile) {
    content.append(
      el(
        'div',
        { class: 'notice' },
        icon('alert'),
        el('div', {}, t('Berkas font sudah tidak ada. Tindakan ini hanya membersihkan entri registri yang tersisa.'))
      )
    );
  }

  if (isProtected) {
    content.append(
      el(
        'div',
        { class: 'notice danger' },
        icon('alert'),
        el(
          'div',
          {},
          t('Font ini termasuk font inti Windows. Menghapusnya dapat membuat teks antarmuka, menu, atau pengaturan tidak terbaca. Hanya lanjutkan jika Anda benar-benar yakin.')
        )
      )
    );
  }

  let backupCheck = null;
  if (hasFile) {
    backupCheck = el('input', { type: 'checkbox', checked: true });
    content.append(
      el(
        'label',
        { class: 'check-row' },
        backupCheck,
        el('span', {}, t('Cadangkan berkas font sebelum dihapus (dapat dipulihkan dari tab Cadangan).'))
      )
    );
  }

  if (hasFile && font.source === 'system') {
    content.append(
      el(
        'div',
        { class: 'notice' },
        icon('info'),
        el('div', {}, t('Font sistem memerlukan izin Administrator. Jendela UAC akan muncul — setujui untuk melanjutkan.'))
      )
    );
  }

  let riskCheck = null;
  if (isProtected) {
    riskCheck = el('input', { type: 'checkbox' });
    content.append(
      el(
        'label',
        { class: 'check-row' },
        riskCheck,
        el('span', {}, t('Saya mengerti risikonya dan tetap ingin menghapus font ini.'))
      )
    );
  }

  const deleteBtn = el(
    'button',
    { class: 'btn danger', type: 'button', disabled: isProtected },
    icon('trash'),
    hasFile ? t('Hapus font') : t('Bersihkan entri')
  );

  if (riskCheck) {
    riskCheck.addEventListener('change', () => {
      deleteBtn.disabled = !riskCheck.checked;
    });
  }

  let closeModal;
  const cancelBtn = el('button', { class: 'btn ghost', type: 'button', onclick: () => closeModal() }, t('Batal'));

  closeModal = openModal({
    title: hasFile ? t('Hapus font ini?') : t('Bersihkan entri registri?'),
    subtitle: hasFile
      ? t('Font akan dihapus dari Windows. Cadangan disimpan secara lokal agar bisa dipulihkan.')
      : t('Entri registri akan dihapus tanpa menyentuh berkas lain.'),
    content,
    footer: [cancelBtn, deleteBtn]
  });

  deleteBtn.addEventListener('click', async () => {
    if (taskGuard()) return;
    closeModal();
    const useBackup = backupCheck ? backupCheck.checked : false;
    releasePreviewFaces();
    const label = fontLabel(font);
    const progressId = newProgressId();
    const task = openTask({
      title: hasFile ? tp('Menghapus {name}', { name: label }) : tp('Membersihkan {name}', { name: label }),
      subtitle: `${font.fileName} · ${fmtBytes(font.size)}`,
      hint: t('Jika jendela UAC muncul, setujui untuk melanjutkan.'),
      rows: [{ name: font.fileName || label, meta: font.subfamily || '' }]
    });
    task.indeterminate('1 berkas');
    const stopPoll = pollTaskProgress(task, progressId, (item) => {
      task.row(0, item.status, item.detail, false);
    });

    try {
      const response = await fetch(
        `/api/fonts/${font.id}?backup=${useBackup ? '1' : '0'}&progressId=${encodeURIComponent(progressId)}`,
        {
          method: 'DELETE',
          headers: { 'x-fm-request': '1' }
        }
      );
      const data = await response.json().catch(() => null);
      if (!data) throw new Error(`HTTP ${response.status}`);

      if (data.ok) {
        task.markAll('done', hasFile ? t('Dihapus') : t('Dibersihkan'));
        task.finish({
          title: t('Penghapusan selesai'),
          subtitle: data.cleaned
            ? `${label} dibersihkan dari daftar pelacakan.`
            : `${label} berhasil dihapus${data.backup ? ' · cadangan tersimpan di tab Cadangan' : ''}.`,
          hint: t('Daftar font sudah diperbarui.'),
          tone: 'done'
        });
        toast(
          'success',
          data.cleaned
            ? `${label} dibersihkan dari daftar pelacakan.`
            : `${label} berhasil dihapus${data.backup ? ' — cadangan tersimpan di tab Cadangan' : ''}.`,
          { timeout: 5000 }
        );
      } else if (data.canceled) {
        task.markAll('pending', t('Dibatalkan'));
        task.finish({
          title: t('Dibatalkan'),
          subtitle: data.error || t('Penghapusan dibatalkan; tidak ada perubahan.'),
          hint: '',
          tone: 'warn',
          autoClose: false
        });
        toast('warn', data.error || t('Penghapusan dibatalkan.'), { timeout: 6000 });
      } else {
        task.markAll('fail', t('Gagal'));
        task.finish({
          title: t('Penghapusan tidak selesai'),
          subtitle: data.error || t('Kesalahan tidak diketahui.'),
          hint: '',
          tone: 'fail',
          autoClose: false
        });
        toast(
          'error',
          tp('Penghapusan tidak selesai: {error}', {
            error: data.error || t('kesalahan tidak diketahui')
          }),
          { timeout: 10000 }
        );
      }
      await loadFonts(true);
      await loadBackups(true);
    } catch (error) {
      task.markAll('fail', t('Gagal'));
      task.finish({
        title: t('Gagal menghapus'),
        subtitle: error.message,
        hint: t('Tidak ada perubahan yang dikonfirmasi server.'),
        tone: 'fail',
        autoClose: false
      });
      toast('error', tp('Gagal menghapus font: {error}', { error: error.message }), { timeout: 8000 });
    } finally {
      stopPoll();
    }
  });
}

function confirmDeleteFamily(group) {
  closeDrawer();

  const files = group.files;
  const existing = files.filter((font) => font.exists);
  const missingCount = files.length - existing.length;
  const isProtected = group.hasProtected;
  const content = el('div', { class: 'modal-body' });

  content.append(
    el(
      'div',
      { class: 'modal-summary' },
      el('div', { class: 'modal-summary-mark' }, logoMark()),
      el(
        'div',
        {},
        el('strong', {}, group.family),
        el('span', {}, `${files.length} berkas · ${fmtBytes(group.totalSize)}`)
      )
    )
  );

  const fileList = el('div', { class: 'modal-file-list' });
  for (const font of files) {
    fileList.append(
      el(
        'div',
        { class: 'modal-file-row' },
        el('span', {}, styleLabel(font, group)),
        el('span', { class: 'mono', title: font.fileName }, font.fileName),
        el('span', { style: { flex: 'none', color: 'var(--muted-2)' } }, fmtBytes(font.size))
      )
    );
  }
  content.append(fileList);

  if (isProtected) {
    content.append(
      el(
        'div',
        { class: 'notice danger' },
        icon('alert'),
        el(
          'div',
          {},
          t('Keluarga ini berisi font inti Windows. Menghapus seluruh keluarga dapat membuat teks antarmuka Windows tidak terbaca.')
        )
      )
    );
  }

  if (missingCount) {
    content.append(
      el(
        'div',
        { class: 'notice' },
        icon('alert'),
        el(
          'div',
          {},
          `${missingCount} dari ${files.length} berkas sudah hilang. Berkas yang hilang hanya akan dibersihkan dari registri.`
        )
      )
    );
  }

  if (existing.length) {
    const backupCheck = el('input', { type: 'checkbox', checked: true });
    content.append(
      el(
        'label',
        { class: 'check-row' },
        backupCheck,
        el('span', {}, tp('Cadangkan {count} berkas sebelum dihapus (satu operasi, dapat dipulihkan dari tab Cadangan).', { count: existing.length }))
      )
    );
    content.append(
      el(
        'div',
        { class: 'notice' },
        icon('info'),
        el('div', {}, t('Semua berkas dihapus dalam satu operasi. Jika ada font sistem, satu jendela UAC akan muncul.'))
      )
    );

    let riskCheck = null;
    if (isProtected) {
      riskCheck = el('input', { type: 'checkbox' });
      content.append(
        el(
          'label',
          { class: 'check-row' },
          riskCheck,
          el('span', {}, t('Saya mengerti risikonya dan tetap ingin menghapus seluruh keluarga ini.'))
        )
      );
    }

    const deleteBtn = el(
      'button',
      { class: 'btn danger', type: 'button', disabled: isProtected },
      icon('trash'),
      tp('Hapus {count} berkas', { count: existing.length })
    );

    if (riskCheck) {
      riskCheck.addEventListener('change', () => {
        deleteBtn.disabled = !riskCheck.checked;
      });
    }

    let closeModal;
    const cancelBtn = el('button', { class: 'btn ghost', type: 'button', onclick: () => closeModal() }, t('Batal'));

    closeModal = openModal({
      title: tp('Hapus keluarga {name}?', { name: group.family }),
      subtitle: t('Seluruh berkas dan entri registri keluarga ini akan dihapus dari Windows.'),
      content,
      footer: [cancelBtn, deleteBtn]
    });

    deleteBtn.addEventListener('click', async () => {
      if (taskGuard()) return;
      closeModal();
      releasePreviewFaces();
      const progressId = newProgressId();
      const rowIndexByFontId = new Map(files.map((font, index) => [font.id, index]));
      const task = openTask({
        title: tp('Menghapus {name}', { name: group.family }),
        subtitle: tp('{count} berkas · menyiapkan cadangan…', { count: fmtNumber(existing.length) }),
        hint: t('Jangan tutup jendela. Jika jendela UAC muncul, setujui untuk melanjutkan.'),
        rows: files.map((font) => ({
          name: font.fileName || fontLabel(font),
          meta: font.subfamily || ''
        }))
      });
      task.indeterminate(tp('{count} berkas', { count: fmtNumber(existing.length) }));
      const stopPoll = pollTaskProgress(task, progressId, (item) => {
        const index = rowIndexByFontId.get(item.id);
        if (index !== undefined) task.row(index, item.status, item.detail, false);
      });

      try {
        const response = await fetch('/api/fonts/delete-batch', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-fm-request': '1' },
          body: JSON.stringify({
            ids: files.map((font) => font.id),
            backup: backupCheck.checked,
            progressId
          })
        });
        const data = await response.json().catch(() => null);
        if (!data) throw new Error(`HTTP ${response.status}`);

        if (data.ok) {
          const backupCount = (data.backups || []).length;
          const removed = Number.isFinite(data.fileCount) ? data.fileCount : existing.length;
          task.markAll('done', t('Dihapus'));
          task.finish({
            title: t('Penghapusan selesai'),
            subtitle:
              tp('{name}: {count} berkas dihapus', {
                name: group.family,
                count: fmtNumber(removed)
              }) + (backupCount ? ' ' + tp('· {count} cadangan tersimpan', { count: fmtNumber(backupCount) }) : '') + '.',
            hint: t('Daftar font sudah diperbarui.'),
            tone: 'done'
          });
          toast(
            'success',
            tp('{name}: {count} berkas dihapus.', { name: group.family, count: removed }),
            { timeout: 6000 }
          );
        } else if (data.canceled) {
          task.markAll('pending', t('Dibatalkan'));
          task.finish({
            title: t('Dibatalkan'),
            subtitle: data.error || t('Penghapusan dibatalkan; tidak ada perubahan.'),
            hint: '',
            tone: 'warn',
            autoClose: false
          });
          toast('warn', data.error || t('Penghapusan dibatalkan.'), { timeout: 6000 });
        } else {
          task.markAll('fail', t('Gagal'));
          task.finish({
            title: t('Penghapusan tidak selesai'),
            subtitle: data.error || t('Kesalahan tidak diketahui.'),
            hint: t('Sebagian berkas mungkin sudah berubah. Pindai ulang untuk memastikan.'),
            tone: 'fail',
            autoClose: false
          });
          toast(
            'error',
            tp('Penghapusan tidak selesai: {error}', {
              error: data.error || t('kesalahan tidak diketahui')
            }),
            { timeout: 10000 }
          );
        }
        await loadFonts(true);
        await loadBackups(true);
      } catch (error) {
        task.markAll('fail', t('Gagal'));
        task.finish({
          title: t('Gagal menghapus'),
          subtitle: error.message,
          hint: t('Tidak ada berkas yang dihapus.'),
          tone: 'fail',
          autoClose: false
        });
          toast('error', tp('Gagal menghapus keluarga font: {error}', { error: error.message }), {
            timeout: 9000
          });
      } finally {
        stopPoll();
      }
    });
    return;
  }

  const cleanupBtn = el('button', { class: 'btn danger', type: 'button' }, icon('trash'), tp('Bersihkan {count} entri', { count: files.length }));
  let closeModal;
  const cancelBtn = el('button', { class: 'btn ghost', type: 'button', onclick: () => closeModal() }, t('Batal'));
  closeModal = openModal({
    title: tp('Bersihkan entri {name}?', { name: group.family }),
    subtitle: t('Tidak ada berkas yang tersisa di disk; hanya entri registri yang akan dibersihkan.'),
    content,
    footer: [cancelBtn, cleanupBtn]
  });

  cleanupBtn.addEventListener('click', async () => {
    if (taskGuard()) return;
    closeModal();
    const progressId = newProgressId();
    const rowIndexByFontId = new Map(files.map((font, index) => [font.id, index]));
    const task = openTask({
      title: tp('Membersihkan {name}', { name: group.family }),
      subtitle: tp('{count} entri registri', { count: fmtNumber(files.length) }),
      hint: t('Jika jendela UAC muncul, setujui untuk melanjutkan.'),
      rows: files.map((font) => ({ name: font.fileName || fontLabel(font), meta: t('entri registri') }))
    });
    task.indeterminate(tp('{count} entri', { count: fmtNumber(files.length) }));
    const stopPoll = pollTaskProgress(task, progressId, (item) => {
      const index = rowIndexByFontId.get(item.id);
      if (index !== undefined) task.row(index, item.status, item.detail, false);
    });

    try {
      const response = await fetch('/api/fonts/delete-batch', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-fm-request': '1' },
        body: JSON.stringify({ ids: files.map((font) => font.id), backup: false, progressId })
      });
      const data = await response.json().catch(() => null);
      if (!data) throw new Error(`HTTP ${response.status}`);

      if (data.ok) {
        task.markAll('done', t('Dibersihkan'));
        task.finish({
          title: t('Pembersihan selesai'),
          subtitle: tp('{name}: {count} entri dibersihkan.', {
            name: group.family,
            count: fmtNumber(data.count)
          }),
          hint: t('Daftar font sudah diperbarui.'),
          tone: 'done'
        });
        toast(
          'success',
          tp('{name}: {count} entri dibersihkan.', { name: group.family, count: data.count }),
          { timeout: 5000 }
        );
      } else if (data.canceled) {
        task.markAll('pending', t('Dibatalkan'));
        task.finish({
          title: t('Dibatalkan'),
          subtitle: data.error || t('Pembersihan dibatalkan.'),
          hint: '',
          tone: 'warn',
          autoClose: false
        });
        toast('warn', data.error || t('Pembersihan dibatalkan.'), { timeout: 6000 });
      } else {
        task.markAll('fail', t('Gagal'));
        task.finish({
          title: t('Pembersihan tidak selesai'),
          subtitle: data.error || t('Kesalahan tidak diketahui.'),
          hint: '',
          tone: 'fail',
          autoClose: false
        });
        toast(
          'error',
          tp('Pembersihan tidak selesai: {error}', {
            error: data.error || t('kesalahan tidak diketahui')
          }),
          { timeout: 10000 }
        );
      }
      await loadFonts(true);
    } catch (error) {
      task.markAll('fail', t('Gagal'));
      task.finish({ title: t('Gagal membersihkan'), subtitle: error.message, hint: '', tone: 'fail', autoClose: false });
      toast('error', tp('Gagal membersihkan entri: {error}', { error: error.message }), {
        timeout: 9000
      });
    } finally {
      stopPoll();
    }
  });
}

function confirmDeleteSelection() {
  const groups = selectedGroups().sort((a, b) => byName(a.family, b.family));
  if (!groups.length) return;

  const files = groups.flatMap((group) => group.files);
  if (files.length > MAX_SELECTION_FILES) {
    toast(
      'warn',
      tp('Pilihan melebihi batas {count} berkas. Kurangi pilihan terlebih dahulu.', {
        count: fmtNumber(MAX_SELECTION_FILES)
      }),
      { timeout: 6500 }
    );
    return;
  }

  const ids = Array.from(new Set(files.map((font) => font.id)));
  const existing = files.filter((font) => font.exists);
  const missingCount = files.length - existing.length;
  const protectedGroups = groups.filter((group) => group.hasProtected);
  const protectedFileCount = protectedGroups.reduce((sum, group) => sum + group.files.length, 0);
  const totalSize = groups.reduce((sum, group) => sum + group.totalSize, 0);
  const content = el('div', { class: 'modal-body' });

  content.append(
    el(
      'div',
      { class: 'modal-summary' },
      el('div', { class: 'modal-summary-mark' }, logoMark()),
      el(
        'div',
        {},
        el('strong', {}, tp('{count} keluarga terpilih', { count: fmtNumber(groups.length) })),
        el('span', {}, tp('{count} berkas · {size}', { count: fmtNumber(files.length), size: fmtBytes(totalSize) }))
      )
    )
  );

  const familyList = el('div', { class: 'modal-file-list' });
  for (const group of groups.slice(0, 80)) {
    familyList.append(
      el(
        'div',
        { class: 'modal-file-row' },
        el('span', { class: 'modal-family-name', title: group.family }, group.family),
        el('span', { class: 'mono' }, tp('{count} berkas', { count: fmtNumber(group.files.length) })),
        el('span', { class: 'modal-row-size' }, fmtBytes(group.totalSize))
      )
    );
  }
  if (groups.length > 80) {
    familyList.append(
      el('div', { class: 'modal-file-row modal-more' }, tp('+{count} keluarga lainnya', { count: fmtNumber(groups.length - 80) }))
    );
  }
  content.append(familyList);

  if (groups.length > 100 || files.length > 500) {
    content.append(
      el(
        'div',
        { class: 'notice' },
        icon('alert'),
        el(
          'div',
          {},
          `Pilihan besar: ${fmtNumber(groups.length)} keluarga / ${fmtNumber(
            files.length
          )} berkas. Pastikan tidak ada keluarga yang masih dibutuhkan; cadangan tetap dibuat.`
        )
      )
    );
  }

  if (protectedGroups.length) {
    content.append(
      el(
        'div',
        { class: 'notice danger' },
        icon('alert'),
        el(
          'div',
          {},
          `${fmtNumber(protectedGroups.length)} keluarga (${fmtNumber(
            protectedFileCount
          )} berkas) berisi font inti Windows. Menghapusnya dapat membuat teks antarmuka Windows tidak terbaca.`
        )
      )
    );
  }

  if (missingCount) {
    content.append(
      el(
        'div',
        { class: 'notice' },
        icon('alert'),
        el(
          'div',
          {},
          tp('{missing} dari {total} berkas sudah hilang. Entri registrinya tetap dibersihkan.', {
            missing: fmtNumber(missingCount),
            total: fmtNumber(files.length)
          })
        )
      )
    );
  }

  let backupCheck = null;
  if (existing.length) {
    backupCheck = el('input', { type: 'checkbox', checked: true });
    content.append(
      el(
        'label',
        { class: 'check-row' },
        backupCheck,
        el(
          'span',
          {},
          tp('Cadangkan {count} berkas sebelum dihapus (dapat dipulihkan dari tab Cadangan).', {
            count: fmtNumber(existing.length)
          })
        )
      )
    );
    content.append(
      el(
        'div',
        { class: 'notice' },
        icon('info'),
        el('div', {}, t('Semua pilihan dihapus dalam satu operasi. Jika ada font sistem, satu jendela UAC akan muncul.'))
      )
    );
  } else {
    content.append(
      el(
        'div',
        { class: 'notice' },
        icon('info'),
        el('div', {}, t('Tidak ada berkas tersisa di disk; hanya entri registri yang akan dibersihkan.'))
      )
    );
  }

  let riskCheck = null;
  if (protectedGroups.length) {
    riskCheck = el('input', { type: 'checkbox' });
    content.append(
      el(
        'label',
        { class: 'check-row' },
        riskCheck,
        el(
          'span',
          {},
          t('Saya mengerti risikonya dan tetap ingin menghapus keluarga inti sistem yang dipilih.')
        )
      )
    );
  }

  const actionLabel = existing.length
    ? tp('Hapus {count} berkas', { count: fmtNumber(existing.length) })
    : tp('Bersihkan {count} entri', { count: fmtNumber(files.length) });
  const deleteBtn = el(
    'button',
    { class: 'btn danger', type: 'button', disabled: protectedGroups.length > 0 },
    icon('trash'),
    actionLabel
  );
  if (riskCheck) {
    riskCheck.addEventListener('change', () => {
      deleteBtn.disabled = !riskCheck.checked;
    });
  }

  let closeModal;
  const cancelBtn = el(
    'button',
    { class: 'btn ghost', type: 'button', onclick: () => closeModal() },
    t('Batal')
  );

  closeModal = openModal({
    title: existing.length
      ? tp('Hapus {count} keluarga terpilih?', { count: fmtNumber(groups.length) })
      : tp('Bersihkan {count} keluarga terpilih?', { count: fmtNumber(groups.length) }),
    subtitle: existing.length
      ? t('Seluruh berkas dan entri registri dari keluarga yang dipilih akan dihapus dari Windows.')
      : t('Tidak ada berkas yang tersisa; hanya entri registri yang akan dibersihkan.'),
    content,
    footer: [cancelBtn, deleteBtn]
  });

  deleteBtn.addEventListener('click', async () => {
    if (taskGuard()) return;
    closeModal();
    releasePreviewFaces();
    const progressId = newProgressId();
    const groupIndexByFontId = new Map();
    groups.forEach((group, groupIndex) => {
      for (const font of group.files) groupIndexByFontId.set(font.id, groupIndex);
    });
    const latestByFontId = new Map();
    const task = openTask({
      title: existing.length
        ? tp('Menghapus {count} keluarga', { count: fmtNumber(groups.length) })
        : tp('Membersihkan {count} keluarga', { count: fmtNumber(groups.length) }),
      subtitle: tp('{count} berkas · menyiapkan cadangan…', { count: fmtNumber(files.length) }),
      hint: t('Satu operasi untuk semua pilihan. Jika jendela UAC muncul, setujui untuk melanjutkan.'),
      rows: groups.map((group) => ({
        name: group.family,
        meta: tp('{count} berkas', { count: fmtNumber(group.files.length) })
      }))
    });
    task.indeterminate(
      tp('{families} keluarga · {files} berkas', {
        families: fmtNumber(groups.length),
        files: fmtNumber(files.length)
      })
    );
    const stopPoll = pollTaskProgress(task, progressId, (item) => {
      latestByFontId.set(item.id, item);
      const groupIndex = groupIndexByFontId.get(item.id);
      if (groupIndex === undefined) return;
      const members = groups[groupIndex].files;
      let done = 0;
      let fail = 0;
      let busyItem = null;
      for (const font of members) {
        const state = latestByFontId.get(font.id);
        if (!state) continue;
        if (state.status === 'done') done++;
        else if (state.status === 'fail') fail++;
        else if (state.status === 'busy') busyItem = state;
      }
      const total = members.length;
      const finished = done + fail;
      if (busyItem) {
        task.row(
          groupIndex,
          'busy',
          tp('{done} / {total}', { done: fmtNumber(finished), total: fmtNumber(total) }) +
            ' · ' +
            t(busyItem.detail || 'Memproses…'),
          false
        );
      } else if (total && finished === total) {
        task.row(
          groupIndex,
          fail ? 'fail' : 'done',
          fail
            ? tp('{count} gagal', { count: fmtNumber(fail) })
            : tp('{count} berkas', { count: fmtNumber(total) }),
          false
        );
      } else {
        task.row(
          groupIndex,
          'pending',
          finished
            ? tp('{done} / {total}', { done: fmtNumber(finished), total: fmtNumber(total) })
            : '',
          false
        );
      }
    });

    try {
      const response = await fetch('/api/fonts/delete-batch', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-fm-request': '1' },
        body: JSON.stringify({
          ids,
          backup: backupCheck ? backupCheck.checked : false,
          progressId
        })
      });
      const data = await response.json().catch(() => null);
      if (!data) throw new Error(`HTTP ${response.status}`);

      if (data.ok) {
        const backupCount = (data.backups || []).length;
        const fileCount = Number.isFinite(data.fileCount)
          ? data.fileCount
          : Number(data.count) || files.length;
        const summary = existing.length
          ? tp('{count} berkas dihapus dari {families} keluarga', {
              count: fmtNumber(fileCount),
              families: fmtNumber(groups.length)
            }) +
            (backupCount ? ' ' + tp('· {count} cadangan tersimpan', { count: fmtNumber(backupCount) }) : '') +
            '.'
          : tp('{families} keluarga: {count} entri dibersihkan.', {
              families: fmtNumber(groups.length),
              count: fmtNumber(data.count || files.length)
            });
        task.markAll('done', existing.length ? t('Dihapus') : t('Dibersihkan'));
        task.finish({
          title: t('Operasi selesai'),
          subtitle: summary,
          hint: t('Daftar font dan cadangan sudah diperbarui.'),
          tone: 'done'
        });
        toast('success', summary, { timeout: 8000 });
        clearSelection();
        setSelectMode(false);
        await loadFonts(true);
        await loadBackups(true);
      } else if (data.canceled) {
        task.markAll('pending', t('Dibatalkan'));
        task.finish({
          title: t('Dibatalkan'),
          subtitle: data.error || t('Penghapusan dibatalkan; tidak ada perubahan.'),
          hint: '',
          tone: 'warn',
          autoClose: false
        });
        toast('warn', data.error || t('Penghapusan dibatalkan.'), { timeout: 6500 });
      } else {
        task.markAll('fail', t('Gagal'));
        task.finish({
          title: t('Penghapusan tidak selesai'),
          subtitle: data.error || t('Kesalahan tidak diketahui.'),
          hint: t('Pindai ulang untuk melihat kondisi terakhir.'),
          tone: 'fail',
          autoClose: false
        });
        toast(
          'error',
          tp('Penghapusan tidak selesai: {error}', {
            error: data.error || t('kesalahan tidak diketahui')
          }),
          { timeout: 10000 }
        );
        await loadFonts(true);
        await loadBackups(true);
      }
    } catch (error) {
      task.markAll('fail', t('Gagal'));
      task.finish({
        title: t('Gagal menghapus'),
        subtitle: error.message,
        hint: t('Tidak ada perubahan yang dikonfirmasi server.'),
        tone: 'fail',
        autoClose: false
      });
      toast('error', tp('Gagal menghapus font terpilih: {error}', { error: error.message }), {
        timeout: 9000
      });
    } finally {
      stopPoll();
    }
  });
}

/* -------------------------------------------------------------- instalasi */

function isFontFile(file) {
  return /\.(ttf|otf|ttc|otc)$/i.test(file.name || '');
}

function installOne(file, onProgress) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `/api/install?filename=${encodeURIComponent(file.name)}`);
    request.setRequestHeader('x-fm-request', '1');
    request.setRequestHeader('content-type', 'application/octet-stream');

    request.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable) return;
      onProgress(event.loaded / Math.max(1, event.total));
    });
    request.addEventListener('load', () => {
      let data = null;
      try {
        data = JSON.parse(request.responseText || 'null');
      } catch {
        data = null;
      }
      if (request.status >= 200 && request.status < 300 && data && data.ok) {
        onProgress(1);
        resolve(data);
      } else {
        reject(new Error((data && data.error) || `HTTP ${request.status}`));
      }
    });
    request.addEventListener('error', () => reject(new Error(t('Koneksi ke server terputus.'))));
    request.addEventListener('abort', () => reject(new Error(t('Pemasangan dibatalkan.'))));
    onProgress(0);
    request.send(file);
  });
}

async function installFiles(fileList) {
  if (taskGuard()) return;
  const all = Array.from(fileList || []);
  const files = all.filter(isFontFile);
  const rejected = all.length - files.length;
  if (!files.length) {
    toast('warn', t('Pilih berkas font .ttf, .otf, .ttc, atau .otc.'));
    return;
  }

  const task = openTask({
    title: tp('Memasang {count} font', { count: fmtNumber(files.length) }),
    subtitle: t('Berkas dipasang satu per satu untuk akun Anda.'),
    hint: t('Biarkan jendela ini terbuka sampai pemasangan selesai.'),
    rows: files.map((file) => ({ name: file.name, meta: fmtBytes(file.size) }))
  });
  task.setProgress(0, tp('0 / {count}', { count: fmtNumber(files.length) }));

  let success = 0;
  const failures = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    task.row(index, 'busy', t('Mengunggah…'));
    task.setSubtitle(tp('Memasang {done}/{total}: {name}', { done: index + 1, total: files.length, name: file.name }));
    try {
      await installOne(file, (fraction) => {
        const overall = (index + Math.min(0.9, fraction * 0.9)) / files.length;
        task.setProgress(
          overall,
          tp('{done} / {total}', { done: fmtNumber(index), total: fmtNumber(files.length) })
        );
        if (fraction >= 1) task.row(index, 'busy', t('Memasang…'));
        else task.row(index, 'busy', tp('Mengunggah {percent}%', { percent: Math.round(fraction * 100) }));
      });
      success++;
      task.row(index, 'done', t('Terpasang'));
    } catch (error) {
      failures.push(`${file.name}: ${error.message}`);
      task.row(index, 'fail', t('Gagal'));
    }
  }

  const summary = failures.length
    ? tp('{ok} berhasil · {failed} gagal dipasang.', {
        ok: fmtNumber(success),
        failed: fmtNumber(failures.length)
      })
    : tp('{count} font berhasil dipasang untuk akun Anda.', { count: fmtNumber(success) });

  task.finish({
    title: failures.length ? t('Pemasangan selesai dengan catatan') : t('Pemasangan selesai'),
    subtitle: summary,
    hint: failures.length
      ? tp('Gagal: {error}', { error: failures[0] })
      : rejected
        ? tp('{count} berkas dilewati karena formatnya tidak didukung.', { count: fmtNumber(rejected) })
        : t('Daftar font sudah diperbarui.'),
    tone: failures.length ? 'fail' : 'done',
    autoClose: !failures.length
  });

  if (success) {
    toast(
      'success',
      tp('{count} font berhasil dipasang untuk akun Anda.', { count: success }),
      { timeout: 5000 }
    );
    await loadFonts(true);
    await loadBackups(true);
    if (state.view === 'backups') renderBackups();
  }
  if (failures.length) {
    toast(
      'error',
      tp('{count} berkas gagal dipasang — {detail}', { count: failures.length, detail: failures[0] }),
      { timeout: 10000 }
    );
  }
  if (rejected) {
    toast(
      'warn',
      tp('{count} berkas dilewati karena formatnya tidak didukung.', { count: rejected }),
      { timeout: 6000 }
    );
  }
}

/* --------------------------------------------------------------- cadangan */

/**
 * Buat cadangan manual untuk satu atau beberapa font. Dipakai tombol
 * Cadangkan di detail font dan di famili Adobe Fonts; hasilnya tampil di tab
 * Cadangan dan dapat dipulihkan ke folder pengguna.
 */
/** Jumlah ID per permintaan; sama dengan batas server (backup-batch). */
const BACKUP_BATCH_SIZE = 500;

function backupSelection() {
  backupFonts(selectedGroups().flatMap((group) => group.files), els.backupSelected);
}

async function backupFonts(fonts, btn) {
  if (taskGuard()) return;
  const list = (fonts || []).filter((font) => font && font.exists);
  if (!list.length) {
    toast('warn', t('Tidak ada berkas font yang dapat dicadangkan.'), { timeout: 4200 });
    return;
  }
  if (btn instanceof HTMLElement) {
    btn.disabled = true;
    btn.classList.add('is-busy');
  }
  try {
    const created = [];
    const failed = [];
    for (let start = 0; start < list.length; start += BACKUP_BATCH_SIZE) {
      const ids = list.slice(start, start + BACKUP_BATCH_SIZE).map((font) => font.id);
      let data;
      try {
        ({ data } = await api('/api/fonts/backup-batch', { method: 'POST', json: { ids } }));
      } catch (error) {
        // Server menjawab 400 bila satu batch seluruhnya gagal; tetap lanjutkan batch lain.
        if (!error.data) throw error;
        data = error.data;
      }
      created.push(...((data && data.backups) || []));
      failed.push(...((data && data.failed) || []));
    }
    if (created.length) {
      await loadBackups(true);
      if (state.view === 'backups') renderBackups();
      toast('success', tp('{count} font dicadangkan.', { count: fmtNumber(created.length) }), {
        timeout: 4200
      });
    }
    if (failed.length) {
      toast(
        'warn',
        tp('{count} font gagal dicadangkan.', { count: fmtNumber(failed.length) }),
        { timeout: 8000 }
      );
    }
  } catch (error) {
    toast('error', tp('Gagal mencadangkan font: {error}', { error: error.message }), { timeout: 8000 });
  } finally {
    if (btn instanceof HTMLElement && btn.isConnected) {
      btn.disabled = false;
      btn.classList.remove('is-busy');
    }
  }
}

async function openBackupFolder(btn) {
  if (btn) btn.disabled = true;
  try {
    await api('/api/backups/folder', { method: 'POST' });
    toast('info', t('Folder cadangan font dibuka di Explorer.'), { timeout: 2400 });
  } catch (error) {
    toast('error', tp('Gagal membuka folder: {error}', { error: error.message }));
  } finally {
    if (btn && btn.isConnected) btn.disabled = false;
  }
}

async function loadBackups(force = false) {
  if (state.backupsLoading) return;
  if (state.backupsLoaded && !force) return;
  state.backupsLoading = true;
  if (state.view === 'backups') renderBackups();
  try {
    const { data } = await api('/api/backups');
    state.backups = (data && data.items) || [];
    state.backupsLoaded = true;
    setCount('backups', state.backups.length);
    if (state.view === 'backups') renderBackups();
  } catch (error) {
    if (state.view === 'backups') {
      els.grid.innerHTML = '';
      els.sentinel.hidden = true;
      els.viewInfo.textContent = t('Gagal memuat');
      showEmpty(t('Gagal memuat cadangan'), error.message, t('Coba lagi'), () => loadBackups(true));
    }
  } finally {
    state.backupsLoading = false;
  }
}

function renderBackups() {
  if (state.selectMode) setSelectMode(false);
  updateSelectionUI();
  els.openBackupFolder.hidden = false;
  els.viewTitle.textContent = t('Cadangan font');
  els.viewSub.textContent = t('Salinan font yang dihapus — dapat dipulihkan kapan saja');
  els.grid.className = 'grid backup-grid';
  els.grid.innerHTML = '';
  els.sentinel.hidden = true;
  hideEmpty();

  if (state.backupsLoading && !state.backupsLoaded) {
    els.viewInfo.textContent = t('Memuat…');
    for (let i = 0; i < 4; i++) {
      els.grid.append(el('div', { class: 'sk', style: { height: '64px', borderRadius: '12px' } }));
    }
    return;
  }

  if (!state.backups.length) {
    els.viewInfo.textContent = t('0 cadangan');
    showEmpty(
      t('Belum ada cadangan'),
      t('Font yang dihapus otomatis disalin ke folder cadangan, dan Anda juga bisa mencadangkan font kapan saja dengan tombol Cadangkan.'),
      null,
      null
    );
    return;
  }

  const list = el('div', { class: 'backup-list' });
  for (const item of state.backups) list.append(createBackupRow(item));
  els.grid.append(list);

  const totalSize = state.backups.reduce((sum, item) => sum + (item.size || 0), 0);
  els.viewInfo.textContent = tp('{count} cadangan · {size}', {
    count: fmtNumber(state.backups.length),
    size: fmtBytes(totalSize)
  });
}

function createBackupRow(item) {
  const row = el('div', { class: 'backup-row' });

  const restoreBtn = el('button', { class: 'btn-mini', type: 'button' }, icon('restore'), t('Pulihkan'));
  restoreBtn.addEventListener('click', () => restoreBackup(item, restoreBtn));

  const deleteBtn = el(
    'button',
    { class: 'btn-mini is-danger', type: 'button', title: t('Hapus cadangan permanen') },
    icon('trash'),
    t('Hapus')
  );
  deleteBtn.addEventListener('click', () => deleteBackup(item));

  const meta = el(
    'div',
    { class: 'backup-meta' },
    el('span', {}, fmtDateTime(item.createdAt || item.deletedAt)),
    el('span', {}, fmtBytes(item.size))
  );
  if (item.mode === 'manual') meta.append(el('span', { class: 'chip' }, t('Manual')));
  if (item.exists === false) meta.append(el('span', { class: 'backup-missing' }, t('berkas cadangan hilang')));
  if (item.protected) meta.append(el('span', { class: 'chip warn' }, t('Inti sistem')));

  row.append(
    el('div', { class: 'backup-mark' }, icon('archive')),
    el(
      'div',
      { class: 'backup-main' },
      el('strong', {}, `${item.family || item.fileName}${item.subfamily ? ' ' + item.subfamily : ''}`),
      el('span', { title: item.originalPath || '' }, item.originalPath || item.fileName || item.file)
    ),
    meta,
    el('div', { class: 'backup-actions' }, restoreBtn, deleteBtn)
  );

  return row;
}

async function restoreBackup(item, btn) {
  if (taskGuard()) return;
  if (btn instanceof HTMLElement) {
    btn.disabled = true;
    btn.classList.add('is-busy');
    btn.innerHTML = '';
    btn.append(icon('refresh'), t('Memulihkan…'));
  }

  const label = item.family || item.fileName || 'font';
  const progressId = newProgressId();
  const task = openTask({
    title: tp('Memulihkan {name}', { name: label }),
    subtitle: `${item.fileName || ''} · ${fmtBytes(item.size)}`,
    hint: t('Berkas cadangan dikembalikan ke lokasi aslinya. Jika jendela UAC muncul, setujui.'),
    rows: [{ name: item.fileName || label, meta: item.subfamily || '' }]
  });
  task.indeterminate('1 berkas');
  const stopPoll = pollTaskProgress(task, progressId, (logItem) => {
    task.row(0, logItem.status, logItem.detail, false);
  });

  try {
    const response = await fetch(`/api/backups/${item.id}/restore`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-fm-request': '1' },
      body: JSON.stringify({ progressId })
    });
    const data = await response.json().catch(() => null);
    if (!data) throw new Error(`HTTP ${response.status}`);

    if (data.ok) {
      task.markAll('done', t('Dipulihkan'));
      const copied = data.copiedAsNew && data.restoredTo;
      task.finish({
        title: t('Pemulihan selesai'),
        subtitle: copied
          ? tp('Berkas {name} dipulihkan ke folder font pengguna.', { name: label })
          : `${label} berhasil dipulihkan.`,
        hint: copied
          ? t('Berkas asli masih ada, jadi cadangan ini dipulihkan sebagai salinan baru.')
          : t('Daftar font sudah diperbarui.'),
        tone: 'done'
      });
      toast(
        'success',
        copied
          ? tp('{name} dipulihkan sebagai salinan baru di folder font pengguna.', { name: label })
          : `${label} berhasil dipulihkan.`,
        { timeout: 5000 }
      );
    } else if (data.restored) {
      task.markAll('done', t('Dipulihkan'));
      task.finish({
        title: t('Pemulihan sebagian'),
        subtitle: tp('Berkas {name} dipulihkan, tetapi pendaftaran registri gagal: {error}.', {
          name: label,
          error: data.error || t('kesalahan tidak diketahui')
        }),
        hint: t('Gunakan Pindai untuk memeriksa status font.'),
        tone: 'warn',
        autoClose: false
      });
      toast(
        'warn',
        tp('Berkas {name} dipulihkan, tetapi pendaftaran registri gagal: {error}', {
          name: label,
          error: data.error || t('kesalahan tidak diketahui')
        }),
        { timeout: 10000 }
      );
    } else if (data.canceled) {
      task.markAll('pending', t('Dibatalkan'));
      task.finish({
        title: t('Dibatalkan'),
        subtitle: data.error || t('Pemulihan dibatalkan.'),
        hint: '',
        tone: 'warn',
        autoClose: false
      });
      toast('warn', data.error || t('Pemulihan dibatalkan.'), { timeout: 6000 });
    } else {
      task.markAll('fail', t('Gagal'));
      task.finish({
        title: t('Pemulihan tidak selesai'),
        subtitle: data.error || t('Kesalahan tidak diketahui.'),
        hint: '',
        tone: 'fail',
        autoClose: false
      });
      toast(
        'error',
        tp('Pemulihan tidak selesai: {error}', {
          error: data.error || t('kesalahan tidak diketahui')
        }),
        { timeout: 10000 }
      );
    }
  } catch (error) {
    task.markAll('fail', t('Gagal'));
    task.finish({
      title: t('Gagal memulihkan'),
      subtitle: error.message,
      hint: '',
      tone: 'fail',
      autoClose: false
    });
    toast('error', tp('Gagal memulihkan font: {error}', { error: error.message }));
  } finally {
    stopPoll();
    if (btn instanceof HTMLElement && btn.isConnected) {
      btn.disabled = false;
      btn.classList.remove('is-busy');
      btn.innerHTML = '';
      btn.append(icon('restore'), t('Pulihkan'));
    }
  }

  await loadBackups(true);
  await loadFonts(true);
  if (state.view === 'backups') renderBackups();
}

async function deleteBackup(item) {
  if (taskGuard()) return;
  const ok = await confirmModal({
    title: t('Hapus cadangan permanen?'),
    subtitle: t('Berkas cadangan akan dihapus dari disk.'),
    message: tp('Cadangan {name} ({size}) akan dihapus dan tidak dapat dipulihkan lagi.', {
      name: item.family || item.fileName,
      size: fmtBytes(item.size)
    }),
    confirmLabel: t('Hapus permanen'),
    tone: 'danger'
  });
  if (!ok) return;

  const label = item.family || item.fileName || t('cadangan');
  const task = openTask({
    title: t('Menghapus cadangan'),
    subtitle: `${label} · ${fmtBytes(item.size)}`,
    hint: t('Berkas cadangan dihapus permanen dari disk.'),
    rows: [{ name: item.fileName || label, meta: item.subfamily || '' }]
  });
  task.indeterminate('1 berkas');

  try {
    await api(`/api/backups/${item.id}`, { method: 'DELETE' });
    task.row(0, 'done', t('Dihapus'));
    task.finish({
      title: t('Cadangan dihapus'),
      subtitle: tp('{name} dihapus permanen.', { name: label }),
      hint: '',
      tone: 'done'
    });
    toast('success', t('Cadangan dihapus.'), { timeout: 3000 });
  } catch (error) {
    task.row(0, 'fail', t('Gagal'));
    task.finish({
      title: t('Gagal menghapus cadangan'),
      subtitle: error.message,
      hint: '',
      tone: 'fail',
      autoClose: false
    });
    toast('error', tp('Gagal menghapus cadangan: {error}', { error: error.message }));
  }
  await loadBackups(true);
  if (state.view === 'backups') renderBackups();
}

/* ------------------------------------------------------------- pemindaian */

function appendUndetectedTracked(fonts, trackedMeta, fontById) {
  /*
   * Font yang dilacak tetapi tidak lagi muncul di hasil pindai (berkas
   * dipindah/dihapus, sinkron Adobe berubah, atau ID lama) dulu hilang
   * begitu saja dari tab Dilacak. Tambahkan sebagai entri sintetis agar
   * keluarga yang dilacak tetap utuh dan bisa dihentikan pelacakannya.
   */
  for (const [id, meta] of Object.entries(trackedMeta || {})) {
    if (fontById.has(id)) continue;
    const family = (meta && meta.family) || (meta && meta.fileName) || t('Font tanpa nama');
    const subfamily = (meta && meta.subfamily) || '';
    const font = {
      id,
      fileName: (meta && meta.fileName) || family,
      filePath: (meta && meta.filePath) || '',
      dir: '',
      family,
      subfamily,
      fullName: [family, subfamily].filter(Boolean).join(' '),
      psName: '',
      faces: [],
      families: [family],
      format: '',
      type: '',
      weightClass: 400,
      weightName: t('Regular'),
      embedding: t('Tidak diketahui'),
      fsType: 0,
      isVariable: false,
      isCollection: false,
      familyFromFileName: false,
      collectionCount: 0,
      isItalic: false,
      parserOk: false,
      size: 0,
      mtime: 0,
      modifiedAt: null,
      exists: false,
      previewable: false,
      source: 'tracked',
      sourceLabel: t(SOURCE_LABELS.tracked),
      protected: false,
      registered: false,
      registry: [],
      tracked: true,
      trackedOnly: true,
      orphan: false
    };
    fonts.push(font);
    fontById.set(id, font);
  }
}

async function loadFonts(force = false) {
  closeDrawer();
  setBusy(true);
  if (!state.fonts.length) {
    renderSkeleton();
    els.viewInfo.textContent = t('Memindai…');
  }

  try {
    const { data } = await api(`/api/fonts${force ? '?refresh=1' : ''}`);
    state.fonts = (data && data.fonts) || [];
    state.fontById = new Map(state.fonts.map((font) => [font.id, font]));
    state.stats = (data && data.stats) || null;
    state.trackedMeta = (data && data.tracked) || {};
    state.tracked = new Set(Object.keys(state.trackedMeta));
    appendUndetectedTracked(state.fonts, state.trackedMeta, state.fontById);
    state.warnings = (data && data.warnings) || [];
    state.scannedAt = (data && data.scannedAt) || null;
    state.fontsVersion++;
    state.families = buildFamilies(state.fonts);
    state.familyByKey = new Map(state.families.map((group) => [group.key, group]));

    if (state.selected.size) {
      const existingKeys = new Set(state.families.map((group) => group.key));
      for (const key of state.selected) {
        if (!existingKeys.has(key)) state.selected.delete(key);
      }
    }

    state.loading = false;

    updateStats();
    updateNavCounts();
    updateScanNote();

    if (state.view === 'backups') renderBackups();
    else render();

    if (state.warnings.length) toast('warn', state.warnings[0], { timeout: 8000 });
    return true;
  } catch (error) {
    state.loading = false;
    els.grid.innerHTML = '';
    els.sentinel.hidden = true;
    els.viewInfo.textContent = t('Gagal memindai');
    showEmpty(
      t('Tidak dapat memindai font'),
      `${error.message}. Pastikan aplikasi dijalankan di Windows dengan PowerShell tersedia.`,
      t('Coba lagi'),
      () => loadFonts(true)
    );
    toast('error', tp('Pemindaian gagal: {error}', { error: error.message }), { timeout: 9000 });
    return false;
  } finally {
    setBusy(false);
  }
}

async function rescanWithPanel() {
  if (taskGuard()) return;
  const task = openTask({
    title: t('Memindai ulang font'),
    subtitle: t('Membaca folder font Windows dan registri…'),
    hint: t('Pemindaian koleksi besar bisa memakan waktu beberapa saat.'),
    rows: [
      { name: t('Folder font sistem'), meta: 'C:\\Windows\\Fonts' },
      { name: t('Folder font pengguna'), meta: '%LOCALAPPDATA%\\Microsoft\\Windows\\Fonts' },
      { name: t('Registri font Windows'), meta: t('HKCU / HKLM') }
    ]
  });
  task.indeterminate(t('Memindai…'));

  try {
    const ok = await loadFonts(true);
    const total = (state.stats && state.stats.total) || state.fonts.length;
    if (ok) {
      task.markAll('done', t('Selesai'));
      task.finish({
        title: t('Pemindaian selesai'),
        subtitle: `${fmtNumber(total)} berkas font terdeteksi.`,
        hint: t('Daftar font sudah diperbarui.'),
        tone: 'done'
      });
    } else {
      task.markAll('fail', t('Gagal'));
      task.finish({
        title: t('Pemindaian gagal'),
        subtitle: t('Lihat pesan kesalahan di daftar utama.'),
        hint: '',
        tone: 'fail',
        autoClose: false
      });
    }
  } catch (error) {
    task.markAll('fail', t('Gagal'));
    task.finish({
      title: t('Pemindaian gagal'),
      subtitle: error.message,
      hint: '',
      tone: 'fail',
      autoClose: false
    });
  }
}

function setBusy(busy) {
  els.refresh.disabled = busy;
  els.refresh.classList.toggle('is-busy', busy);
}

function updateStats() {
  if (!state.stats) return;
  const counts = familyCounts();
  els.stats.total.textContent = fmtNumber(counts.all);
  els.stats.total.title = tp('{count} keluarga font', { count: fmtNumber(counts.all) });
  els.stats.files.textContent = fmtNumber(state.stats.total);
  els.stats.system.textContent = fmtNumber(counts.system);
  els.stats.user.textContent = fmtNumber(counts.user);
  els.stats.size.textContent = fmtBytes(state.stats.totalSize);
  els.stats.tracked.textContent = fmtNumber(counts.tracked);
}

function updateNavCounts() {
  if (!state.stats) return;
  const counts = familyCounts();
  setCount('all', counts.all);
  setCount('system', counts.system);
  setCount('user', counts.user);
  setCount('custom', counts.custom);
  setCount('adobe', counts.adobe);
  setCount('tracked', counts.tracked);
  setCount('missing', counts.missing);
  setCount('backups', state.backups.length);

  const customItem = $('.nav-item[data-view="custom"]', els.nav);
  if (customItem) customItem.classList.toggle('is-hidden', !counts.custom);
  const adobeItem = $('.nav-item[data-view="adobe"]', els.nav);
  if (adobeItem) adobeItem.classList.toggle('is-hidden', !counts.adobe);
}

function setCount(view, value) {
  const node = $(`[data-count="${view}"]`);
  if (!node) return;
  node.textContent = fmtNumber(value);
}

function updateScanNote() {
  if (!state.stats) return;
  els.scanNote.textContent = tp('Terakhir dipindai {time} · {count} berkas · {size}', {
    time: fmtTime(state.scannedAt),
    count: fmtNumber(state.stats.total),
    size: fmtBytes(state.stats.totalSize)
  });
}

/* -------------------------------------------------------------- navigasi */

function setView(view) {
  if (!VIEWS[view] && view !== 'backups') return;
  if (view === 'backups') {
    if (state.selectMode) setSelectMode(false);
  } else if (state.selectMode) {
    clearSelection();
  }
  state.view = view;
  for (const btn of $$('.nav-item', els.nav)) {
    btn.classList.toggle('is-active', btn.dataset.view === view);
  }

  window.scrollTo({ top: 0, behavior: 'auto' });

  if (view === 'backups') {
    loadBackups();
    renderBackups();
    return;
  }

  render();
  if (state.query) els.search.focus();
}

/* ---------------------------------------------------------------- events */

function savePrefs() {
  try {
    localStorage.setItem(
      'fm:prefs',
      JSON.stringify({
        v: 3,
        sample: state.sample,
        size: state.size,
        sort: state.sort,
        lang: window.I18N.getLanguage()
      })
    );
  } catch {
    /* abaikan */
  }
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem('fm:prefs');
    if (!raw) return;
    const saved = JSON.parse(raw);

    if (saved.lang === 'id' || saved.lang === 'en') {
      window.I18N.setLanguage(saved.lang);
    }

    // Versi lama menyimpan teks contoh statis. Pratinjau kini otomatis memakai
    // nama font, jadi teks contoh lama tidak dipulihkan.
    if (
      (saved.v === 2 || saved.v === 3) &&
      typeof saved.sample === 'string' &&
      saved.sample.trim() &&
      saved.sample.trim() !== DEFAULT_SAMPLE
    ) {
      state.sample = saved.sample;
      els.sample.value = saved.sample;
    }
    if (Number.isFinite(saved.size)) {
      state.size = Math.min(76, Math.max(14, Math.round(saved.size)));
      els.size.value = String(state.size);
      els.sizeValue.textContent = String(state.size);
    }
    if (['family', 'size', 'recent', 'weight'].includes(saved.sort)) {
      state.sort = saved.sort;
      els.sort.value = saved.sort;
    }
  } catch {
    /* abaikan */
  }
}

function bindEvents() {
  els.nav.addEventListener('click', (event) => {
    const btn = event.target.closest('.nav-item');
    if (!btn || !btn.dataset.view) return;
    setView(btn.dataset.view);
  });

  const applySearch = debounce(() => {
    if (state.selectMode) clearSelection();
    state.query = els.search.value;
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, 150);
  els.search.addEventListener('input', applySearch);
  els.search.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (state.selectMode) clearSelection();
      els.search.value = '';
      state.query = '';
      render();
      window.scrollTo({ top: 0, behavior: 'auto' });
      els.search.blur();
    }
  });

  const applySample = debounce(() => {
    state.sample = els.sample.value;
    updateSamples();
    savePrefs();
  }, 100);
  els.sample.addEventListener('input', applySample);

  els.size.addEventListener('input', () => {
    state.size = Number(els.size.value);
    els.sizeValue.textContent = String(state.size);
    updateSamples();
    savePrefs();
  });

  els.sort.addEventListener('change', () => {
    state.sort = els.sort.value;
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
    savePrefs();
  });

  els.select.addEventListener('click', () => setSelectMode(!state.selectMode));
  els.selectVisible.addEventListener('click', selectVisibleGroups);
  els.selectAll.addEventListener('click', selectAllResults);
  els.clearSelection.addEventListener('click', clearSelection);
  els.deleteSelected.addEventListener('click', confirmDeleteSelection);
  els.backupSelected.addEventListener('click', backupSelection);

  els.loadMore.addEventListener('click', () => appendBatch());
  els.refresh.addEventListener('click', () => rescanWithPanel());
  els.install.addEventListener('click', () => els.fileInput.click());
  els.openBackupFolder.addEventListener('click', () => openBackupFolder(els.openBackupFolder));
  els.fileInput.addEventListener('change', () => {
    installFiles(els.fileInput.files);
    els.fileInput.value = '';
  });

  els.overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !isTypingTarget(event.target) && els.modalRoot.hidden) {
      event.preventDefault();
      els.search.focus();
      els.search.select();
    }
    if (event.key === 'Escape') {
      if (!els.modalRoot.hidden && closeModalHandler) {
        closeModalHandler();
        return;
      }
      if (els.drawer.hidden) return;
      if (state.activeFontId && state.fileBackKey) {
        const group = state.familyByKey.get(state.fileBackKey);
        if (group) {
          openFamilyDrawer(group);
          return;
        }
      }
      closeDrawer();
    }
  });

  window.addEventListener('dragenter', onDragEnter);
  window.addEventListener('dragover', onDragOver);
  window.addEventListener('dragleave', onDragLeave);
  window.addEventListener('drop', onDrop);

  for (const btn of $$('.lang-btn')) {
    btn.addEventListener('click', () => changeLanguage(btn.dataset.lang));
  }
}

let dragDepth = 0;

function hasFiles(event) {
  return !!(event.dataTransfer && Array.from(event.dataTransfer.types || []).includes('Files'));
}

function onDragEnter(event) {
  if (!hasFiles(event)) return;
  event.preventDefault();
  dragDepth++;
  els.dropOverlay.hidden = false;
}

function onDragOver(event) {
  if (!hasFiles(event)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function onDragLeave() {
  if (dragDepth === 0) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) els.dropOverlay.hidden = true;
}

function onDrop(event) {
  if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) return;
  event.preventDefault();
  dragDepth = 0;
  els.dropOverlay.hidden = true;
  installFiles(event.dataTransfer.files);
}

/* ------------------------------------------------------------------- init */

/* ------------------------------------------------- bahasa & layar pembuka */

const SPLASH_STAGE_KEYS = {
  idle: 'Menyiapkan…',
  folder: 'Memindai folder font…',
  registry: 'Membaca registri Windows…',
  metadata: 'Membaca metadata font…',
  adobe: 'Menambahkan font Adobe Fonts…',
  ready: 'Selesai'
};

const splashView = {
  active: false,
  target: 0,
  shown: 0,
  raf: null,
  pollTimer: null,
  minUntil: 0
};

function syncLanguageButtons() {
  for (const btn of $$('.lang-btn')) {
    btn.classList.toggle('is-active', btn.dataset.lang === window.I18N.getLanguage());
  }
}

function applyLanguageUI() {
  window.I18N.applyStatic(document);
  document.documentElement.lang = window.I18N.getLanguage() === 'en' ? 'en' : 'id';
  syncLanguageButtons();
}

function refreshAfterLanguageChange() {
  applyLocaleFormats();
  applyLanguageUI();
  savePrefs();
  updateStats();
  updateNavCounts();
  updateScanNote();
  render();
  if (els.drawer && !els.drawer.hidden) {
    const group = state.activeFamilyKey ? state.familyByKey.get(state.activeFamilyKey) : null;
    const font = state.activeFontId ? state.fontById.get(state.activeFontId) : null;
    if (font) {
      openDrawer(font, { backToFamily: state.fileBackKey || undefined });
    } else if (group) {
      openFamilyDrawer(group);
    }
  }
}

function changeLanguage(lang) {
  if (!['id', 'en'].includes(lang) || lang === window.I18N.getLanguage()) return;
  window.I18N.setLanguage(lang);
  refreshAfterLanguageChange();
}

function setSplashStage(stage) {
  if (!els.splashStage) return;
  els.splashStage.textContent = t(SPLASH_STAGE_KEYS[stage] || SPLASH_STAGE_KEYS.idle);
}

function updateSplashDom(value) {
  if (els.splashBar) els.splashBar.style.width = `${value}%`;
  if (els.splashPercent) els.splashPercent.textContent = String(value);
}

function splashTick() {
  if (!splashView.active) return;
  const diff = splashView.target - splashView.shown;
  splashView.shown = Math.abs(diff) < 0.4 ? splashView.target : splashView.shown + diff * 0.12;
  updateSplashDom(Math.round(splashView.shown));
  splashView.raf = requestAnimationFrame(splashTick);
}

function setSplashProgress(percent, stage) {
  if (stage && SPLASH_STAGE_KEYS[stage]) setSplashStage(stage);
  splashView.target = Math.max(0, Math.min(100, Number(percent) || 0));
}

async function splashPoll() {
  if (!splashView.active) return;
  try {
    const response = await fetch('/api/scan-progress');
    const data = await response.json().catch(() => null);
    if (data && data.scan) setSplashProgress(data.scan.percent, data.scan.stage);
  } catch {
    /* server belum siap — coba lagi pada tick berikutnya */
  }
  if (splashView.active) splashView.pollTimer = setTimeout(splashPoll, 200);
}

function startSplash() {
  if (!els.splash) return;
  splashView.active = true;
  splashView.target = 0;
  splashView.shown = 0;
  splashView.minUntil = Date.now() + 700;
  els.splash.hidden = false;
  els.splash.classList.remove('is-leaving');
  setSplashStage('idle');
  updateSplashDom(0);
  splashView.raf = requestAnimationFrame(splashTick);
  splashPoll();
}

async function finishSplash() {
  if (!splashView.active) return;
  clearTimeout(splashView.pollTimer);
  cancelAnimationFrame(splashView.raf);
  setSplashStage('ready');
  splashView.target = 100;
  updateSplashDom(100);
  const wait = Math.max(splashView.minUntil - Date.now(), 260);
  await new Promise((resolve) => setTimeout(resolve, wait));
  if (!splashView.active) return;
  splashView.active = false;
  if (els.splash) {
    els.splash.classList.add('is-leaving');
    setTimeout(() => {
      if (els.splash) els.splash.hidden = true;
    }, 340);
  }
}

async function loadAppInfo() {
  try {
    const { data } = await api('/api/status');
    if (data && data.version) {
      els.appVersion.textContent = tp('Font Manager v{version}', { version: data.version });
      document.title = tp('Font Manager v{version}', { version: data.version });
    }
  } catch {
    /* versi opsional; aplikasi tetap jalan */
  }
}

function cacheElements() {
  els = {
    nav: $('#nav'),
    grid: $('#grid'),
    sentinel: $('#sentinel'),
    loadMore: $('#loadMoreBtn'),
    search: $('#searchInput'),
    sample: $('#sampleInput'),
    size: $('#sizeInput'),
    sizeValue: $('#sizeValue'),
    sort: $('#sortSelect'),
    select: $('#selectBtn'),
    selectionBar: $('#selectionBar'),
    selectionCount: $('#selectionCount'),
    selectionMeta: $('#selectionMeta'),
    selectVisible: $('#selectVisibleBtn'),
    selectAll: $('#selectAllBtn'),
    clearSelection: $('#clearSelectionBtn'),
    backupSelected: $('#backupSelectedBtn'),
    deleteSelected: $('#deleteSelectedBtn'),
    refresh: $('#refreshBtn'),
    install: $('#installBtn'),
    fileInput: $('#fileInput'),
    viewTitle: $('#viewTitle'),
    viewSub: $('#viewSub'),
    viewInfo: $('#viewInfo'),
    openBackupFolder: $('#openBackupFolderBtn'),
    empty: $('#emptyState'),
    emptyTitle: $('#emptyTitle'),
    emptyText: $('#emptyText'),
    emptyAction: $('#emptyAction'),
    drawer: $('#drawer'),
    overlay: $('#drawerOverlay'),
    modalRoot: $('#modalRoot'),
    toasts: $('#toasts'),
    dropOverlay: $('#dropOverlay'),
    scanNote: $('#scanNote'),
    splash: $('#splash'),
    splashStage: $('#splashStage'),
    splashBar: $('#splashBarFill'),
    splashPercent: $('#splashPercent'),
    appVersion: $('#appVersion'),
    stats: {
      total: $('#statTotal'),
      files: $('#statFiles'),
      system: $('#statSystem'),
      user: $('#statUser'),
      size: $('#statSize'),
      tracked: $('#statTracked')
    }
  };
}

function applyInitialQuery() {
  let query = '';
  try {
    query = new URLSearchParams(window.location.search).get('q') || '';
  } catch {
    query = '';
  }
  const view = (() => {
    try {
      return new URLSearchParams(window.location.search).get('view') || '';
    } catch {
      return '';
    }
  })();
  if (query) {
    state.query = query;
    els.search.value = query;
  }
  if (view) state.view = view;
}

async function init() {
  cacheElements();
  document.body.classList.remove('no-scroll');
  applyIcons();
  loadPrefs();
  applyLocaleFormats();
  applyLanguageUI();
  bindEvents();
  applyInitialQuery();
  startSplash();
  renderSkeleton();
  els.viewInfo.textContent = t('Memindai…');
  await Promise.all([loadFonts(false), loadBackups(false), loadAppInfo()]);
  await finishSplash();
}

document.addEventListener('DOMContentLoaded', init);
