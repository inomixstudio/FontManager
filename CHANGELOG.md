# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di berkas ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan
[Semantic Versioning](https://semver.org/lang/id/).

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

[1.2.0]: https://github.com/inomixstudio/FontManager/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/inomixstudio/FontManager/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/inomixstudio/FontManager/releases/tag/v1.2.0
