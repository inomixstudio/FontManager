'use strict';

const { execFile } = require('child_process');

const FONT_REG_KEY_HKLM = 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts';
const FONT_REG_KEY_HKCU = 'HKCU:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts';

const FONT_REG_VALUES = [
  { root: 'HKLM', path: FONT_REG_KEY_HKLM },
  { root: 'HKCU', path: FONT_REG_KEY_HKCU }
];

function psQuote(value) {
  return "'" + String(value == null ? '' : value).replace(/'/g, "''") + "'";
}

function stripBom(text) {
  return String(text || '').replace(/^\uFEFF/, '');
}

function runPowerShell(command, options = {}) {
  const args = [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    command
  ];
  return new Promise((resolve) => {
    execFile(
      'powershell.exe',
      args,
      {
        windowsHide: true,
        maxBuffer: 64 * 1024 * 1024,
        timeout: options.timeout || 60000
      },
      (error, stdout, stderr) => {
        resolve({
          ok: !error,
          code: error && typeof error.code === 'number' ? error.code : 0,
          stdout: stdout || '',
          stderr: stderr || (error ? error.message : '')
        });
      }
    );
  });
}

function runPowerShellFile(scriptPath, options = {}) {
  const args = [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    scriptPath
  ];
  return new Promise((resolve) => {
    execFile(
      'powershell.exe',
      args,
      {
        windowsHide: true,
        maxBuffer: 32 * 1024 * 1024,
        timeout: options.timeout || 180000
      },
      (error, stdout, stderr) => {
        resolve({
          ok: !error,
          code: error && typeof error.code === 'number' ? error.code : 0,
          stdout: stdout || '',
          stderr: stderr || (error ? error.message : '')
        });
      }
    );
  });
}

const REGISTRY_READ_SCRIPT = `
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$result = New-Object System.Collections.ArrayList
$targets = @(
  @{ Path = ${psQuote(FONT_REG_KEY_HKLM)}; Root = 'HKLM' },
  @{ Path = ${psQuote(FONT_REG_KEY_HKCU)}; Root = 'HKCU' }
)
foreach ($target in $targets) {
  if (-not (Test-Path -LiteralPath $target.Path)) { continue }
  try {
    $props = Get-ItemProperty -LiteralPath $target.Path -ErrorAction Stop
  } catch { continue }
  foreach ($prop in $props.PSObject.Properties) {
    if ($prop.Name -like 'PS*') { continue }
    if ($prop.Name -eq '(default)') { continue }
    $value = [string]$prop.Value
    if ([string]::IsNullOrWhiteSpace($value)) { continue }
    [void]$result.Add([pscustomobject]@{
      root  = $target.Root
      key   = $target.Path
      name  = [string]$prop.Name
      value = $value
    })
  }
}
if ($result.Count -eq 0) { '[]' } else { ConvertTo-Json -InputObject @($result) -Compress -Depth 4 }
`;

function parseJsonArray(text) {
  const raw = stripBom(text).trim();
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') return [parsed];
  return [];
}

/**
 * Membaca seluruh nilai di kunci registri Fonts (HKLM + HKCU).
 * @returns {Promise<{entries: Array<{root:string,key:string,name:string,value:string}>, error: string|null}>}
 */
async function readRegistryFonts() {
  if (process.platform !== 'win32') {
    return { entries: [], error: 'Registri Windows hanya tersedia di Windows.' };
  }
  const result = await runPowerShell(REGISTRY_READ_SCRIPT, { timeout: 45000 });
  if (!result.ok) {
    return {
      entries: [],
      error: cleanError(result.stderr) || 'Gagal membaca registri font.'
    };
  }
  try {
    const entries = parseJsonArray(result.stdout)
      .filter((entry) => entry && entry.name && entry.value)
      .map((entry) => ({
        root: entry.root === 'HKCU' ? 'HKCU' : 'HKLM',
        key: String(entry.key || (entry.root === 'HKCU' ? FONT_REG_KEY_HKCU : FONT_REG_KEY_HKLM)),
        name: String(entry.name),
        value: String(entry.value)
      }));
    return { entries, error: null };
  } catch (error) {
    return { entries: [], error: 'Respons registri tidak dapat dibaca: ' + error.message };
  }
}

function cleanError(text) {
  const raw = stripBom(text || '').trim();
  if (!raw) return '';
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^\+|^At line|^CategoryInfo|^FullyQualifiedErrorId|^\s*\+/.test(line))
    .slice(0, 4)
    .join(' ');
}

module.exports = {
  FONT_REG_KEY_HKLM,
  FONT_REG_KEY_HKCU,
  FONT_REG_VALUES,
  psQuote,
  stripBom,
  cleanError,
  runPowerShell,
  runPowerShellFile,
  readRegistryFonts
};
