# Berkontribusi

Terima kasih sudah ingin membantu. Proyek ini kecil dan tanpa dependensi — mudah dijalankan dan
diubah.

## Lingkungan pengembangan

| Kebutuhan | Keterangan |
| --- | --- |
| Windows 10/11 | Aplikasi memakai registri, PowerShell, dan UAC |
| Node.js 18+ | Tanpa `npm install`; tidak ada dependensi |
| .NET Framework 4.x + WebView2 | Hanya jika ingin membangun ulang host desktop |

```bat
:: jalankan server tanpa membuka jendela desktop
set FM_NO_OPEN=1
node server.js

:: aktifkan log permintaan
set FM_DEBUG=1
node server.js

:: bangun ulang host desktop (opsional)
desktop\build-desktop.bat
```

Variabel lingkungan yang dikenal: `PORT`, `FM_NO_OPEN`, `FM_DEBUG`, `FM_PARENT_PID`.

## Struktur kode

| Berkas | Tanggung jawab |
| --- | --- |
| `server.js` | Rute HTTP/API, validasi permintaan, penyajian statis & berkas font |
| `lib/fontParser.js` | Parser tabel sfnt (`name`, `OS/2`, `head`, `fvar`, TTC) |
| `lib/registry.js` | Pembacaan registri font Windows dan eksekusi PowerShell |
| `lib/scanner.js` | Pemindaian folder + registri, cache metadata, statistik |
| `lib/adobeFonts.js` | Font Adobe Fonts (CoreSync, entitlement, ID stabil) |
| `lib/manage.js` | Hapus, pasang, pulihkan, cadangan, progres operasi |
| `lib/store.js` | Penyimpanan lacak & indeks cadangan |
| `public/` | Antarmuka: `index.html`, `styles.css`, `app.js` (tanpa framework) |
| `desktop/` | Host WinForms + WebView2 (`FontManagerHost.cs`) |

Panduan singkat:
- Gaya kode: CommonJS, `'use strict'`, 2 spasi, tanda kutip tunggal, tanpa dependensi baru.
- UI: semua teks dinamis lewat `textContent`/`el()` — **jangan** memakai `innerHTML` untuk data
  dari berkas font atau pengguna.
- Operasi destruktif wajib mencadangkan lebih dulu dan memakai skrip PowerShell, bukan perintah
  shell yang dirangkai dari string.
- Pesan yang dilihat pengguna memakai bahasa Indonesia.

## Uji

```bat
node --check server.js
node --check public/app.js
for %f in (lib\*.js) do node --check %f

:: uji end-to-end: pasang → hapus tunggal → pulihkan → hapus massal → progres
npm test
```

`npm test` mengurus server ujinya sendiri (memakai port bebas) dan menghentikannya lagi setelah
selesai. Uji ini memasang dan menghapus beberapa salinan font di akun Anda, lalu membersihkan
cadangannya. Jangan jalankan pada mesin produksi yang fontnya kritis.

## Mengirim perubahan

1. Buat branch dari `main` (`fix/...`, `feat/...`, `docs/...`).
2. Jaga perubahan tetap fokus; sertakan alasan di deskripsi commit.
3. Pastikan `node --check` lolos dan uji manual di aplikasi desktop.
4. Buka pull request dan jelaskan perilaku sebelum/sesudah.

### Gaya commit

```
Perbaiki ringkas: apa yang berubah

Alasan singkat dan dampaknya bagi pengguna:
- poin perubahan
```

## Melaporkan bug

Gunakan [issue template](.github/ISSUE_TEMPLATE/bug_report.yml) dan sertakan versi aplikasi,
versi Windows/Node.js, langkah reproduksi, dan isi `%LOCALAPPDATA%\FontManager\error.log` bila ada.

Jangan melampirkan berkas font berlisensi. Untuk masalah keamanan, ikuti [SECURITY.md](SECURITY.md).
