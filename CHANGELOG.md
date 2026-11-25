# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di berkas ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan
[Semantic Versioning](https://semver.org/lang/id/).

## [1.2.3] — 2026-11-25

### Ditambahkan
- Tombol **Cadangkan terpilih** pada mode Pilih untuk mencadangkan beberapa keluarga font sekaligus.
- Tombol **Cadangkan** di detail font dan detail famili Adobe Fonts, serta tombol **Buka folder**
  di tab Cadangan.
- Antarmuka dua bahasa: tombol **ID/EN** di bilah atas, dengan pilihan bahasa tersimpan.

### Diperbaiki
- Cadangan Adobe Fonts diganti namanya ke nama font asli (cadangan lama ikut diganti saat server dijalankan).
- Rekonsiliasi cadangan saat startup kembali berjalan (sebelumnya memanggil fungsi yang tidak ada).
- Cadangan manual tetap disimpan setelah dipulihkan sebagai salinan.
- Pencadangan massal dipecah per 500 font sesuai batas server.
- Nama cadangan hanya membuang ekstensi font, jadi nama seperti "Font 1.5" tidak lagi terpotong.
- Status progres pemindaian tidak tertinggal aktif bila pemindaian gagal.

## [1.2.2] — 2026-11-24

### Ditambahkan
- API kini bisa dipanggil **panel UXP Photoshop** (mis. `com.99desains.sampul`): asal `uxp:`
  dan `null` (file://) diizinkan, respons API membawa `Access-Control-Allow-Origin` (+
  `Access-Control-Allow-Private-Network` untuk Chromium), dan preflight `OPTIONS` dijawab
  dengan daftar method serta header `Content-Type`, `X-Font-Name`, `X-FM-Request` — sehingga
  panel dapat memasang font langsung lewat `POST /api/install`.
- Asal lokal (`localhost`/`127.0.0.1`) diizinkan untuk port berapa pun, bukan hanya port server
  ini, supaya alat lokal lain bisa memakai API yang sama.

### Keamanan
- Pemeriksaan `Host` (anti DNS rebinding) dan syarat `X-FM-Request` untuk operasi tulis tetap
  berlaku; asal jarak jauh (situs web mana pun) masih ditolak dengan 403.

## [1.2.1] — 2026-11-23

### Diperbaiki
- `npm test` berjalan mandiri (server uji dimulai otomatis) dan kini menguji pemulihan cadangan;
  CI menjalankan uji end-to-end ini.
- Keluarga/font yang dilacak tetapi berkasnya tidak terdeteksi dapat dibersihkan (berhenti
  melacak) alih-alih gagal 404.
- Server tidak lagi bisa jatuh saat berkas font/statis hilang di tengah-tengah: stream kini
  menangani kejadian `error`.
- Berkas sampah berekstensi `.ttf`/`.otf` ditolak sebelum ditulis dan didaftarkan ke registri.
- Cadangan yatim di `data/backups/` direkonsiliasi saat aplikasi mulai.
- Path permintaan tidak valid memakai status 400 (bukan 500); header CSP dan `Referrer-Policy`
  diterapkan ke semua respons.
- `track-batch` menolak permintaan di atas 500 ID alih-alih memotong diam-diam.
- `entitlements.xml` Adobe dicadangkan (`.bak`) sebelum pertama kali diubah.
- Folder data berpindah ke `%LOCALAPPDATA%\FontManager\data` bila folder aplikasi tidak dapat
  ditulis (mis. diekstrak ke Program Files).
- Unit test (`scripts/selftest.js`) untuk parser sfnt, rekonsiliasi cadangan, dan pelacakan;
  `npm test` menjalankan unit test lalu uji end-to-end.

## [1.2.0] — 2026-11-23

Rilis konsolidasi: dukungan Adobe Fonts, pelacakan keluarga yang andal, dan host desktop yang
tahan macet.

### Ditambahkan
- **Dukungan Adobe Fonts**: font langganan Creative Cloud dideteksi dari
  `%APPDATA%\Adobe\CoreSync\plugins\livetype`, tampil di tab **Adobe** dengan pratinjau dan tautan
  ke fonts.adobe.com; dapat dilacak, dicadangkan, dihapus, dan dipulihkan.
- Penghapusan font Adobe mencabut entri *entitlement* agar tidak diunduh ulang; pemulihan
  mendaftarkannya kembali.
- Tombol **Lepas** pada keluarga yang dilacak tetapi berkasnya tidak terdeteksi.

### Diperbaiki
- **Menu Adobe tidak berfungsi** — view `adobe` belum terdaftar sehingga klik menu diabaikan.
- **Keluarga yang dilacak tampak terpecah/hilang** — ID font Adobe kini memakai id sinkronisasi
  (bukan hash path), entri lacak lama dimigrasikan otomatis, dan entri yang tidak terdeteksi tetap
  ditampilkan dengan chip *tidak terdeteksi*.
- Metadata lacak diisi server dari cache pindai sehingga path/nama berkas tidak pernah kosong.
- Font Adobe tidak lagi ditandai *Belum terdaftar* atau masuk *Entri bermasalah*.
- **Host desktop tahan macet** — instans tanpa jendela yang memegang kunci satu-instans dibersihkan
  otomatis; server dipantau dan kesalahan dicatat ke `%LOCALAPPDATA%\FontManager\error.log`.
- Operasi hapus tanpa daftar kerja tidak lagi dilaporkan gagal (`Registri undefined`).
- Berkas cadangan yang tersingkir dari indeks ikut dihapus sehingga tidak menumpuk.
- Batas waktu skrip mengikuti jumlah operasi (hapus massal ribuan berkas).
- Payload daftar font di-cache (JSON + gzip) per generasi pemindaian.

## [1.1.0] — 2026-11-22

### Ditambahkan
- Tab dan filter sumber **Adobe**, chip khusus, serta tautan fonts.adobe.com di detail berkas.

### Diperbaiki
- Laporan hasil operasi hapus yang keliru untuk daftar kosong.
- Kebocoran berkas cadangan yatim saat indeks melewati 300 entri.
- Batas waktu skrip PowerShell untuk hapus massal besar.
- Kompresi ulang payload daftar font pada setiap permintaan.

## [1.0.0] — 2026-11-21

### Ditambahkan
- Pemindaian registri Windows (HKLM + HKCU) dan folder font sistem/pengguna.
- Pengelompokan satu kartu per keluarga, termasuk koleksi TTC/OTC dan pola nama lama.
- Pratinjau asli per gaya, pencarian, filter, dan pengurutan.
- Pelacakan keluarga, penghapusan per keluarga dan massal, cadangan otomatis & pemulihan.
- Pemasangan font per pengguna, panel progres per berkas, dan penanda font inti sistem.
- Host desktop WinForms + WebView2 dengan peluncur `start.bat`.

[1.2.1]: https://github.com/inomixstudio/FontManager/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/inomixstudio/FontManager/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/inomixstudio/FontManager/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/inomixstudio/FontManager/releases/tag/v1.0.0
