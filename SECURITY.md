# Kebijakan Keamanan

## Melaporkan celah keamanan

**Jangan** membuka issue publik untuk masalah keamanan.

Gunakan salah satu jalur privat:

1. **GitHub Security Advisories** (disarankan):
   <https://github.com/inomixstudio/FontManager/security/advisories/new>
2. Jika tidak memungkinkan, hubungi pemelihara lewat pesan langsung di GitHub
   ([@inomixstudio](https://github.com/inomixstudio)).

Sertakan bila ada: versi Font Manager, versi Windows dan Node.js, langkah reproduksi, serta
dampak yang mungkin terjadi. Mohon **jangan** menyertakan berkas font berlisensi atau data pribadi
dalam lampiran.

### Yang diharapkan

| Tahap | Target |
| --- | --- |
| Konfirmasi penerimaan laporan | 3 hari kerja |
| Penilaian awal & rencana perbaikan | 7 hari kerja |
| Perbaikan untuk masalah berisiko tinggi | 30 hari kerja |

Kami akan memberi kredit pada catatan rilis bila Anda menginginkannya. Tidak ada program bug
bounty; ini proyek perorangan tanpa pendanaan.

## Versi yang didukung

Perbaikan keamanan hanya diterbitkan untuk rilis terbaru.

| Versi | Didukung |
| --- | --- |
| 1.2.x | ✅ |
| < 1.2 | ❌ |

## Model keamanan

Font Manager adalah aplikasi **lokal** yang mengelola berkas dan registri Windows, sehingga
permukaan serangannya dirancang sesempit mungkin.

### Server lokal

- Hanya mengikat `127.0.0.1` (tidak dapat diakses dari jaringan).
- Memvalidasi header `Host` hanya untuk `127.0.0.1`/`localhost` (mitigasi DNS rebinding).
- Menolak `Origin` lintas asal dan mewajibkan header `X-FM-Request: 1` pada semua permintaan
  tulis (mitigasi CSRF dari halaman web lain di browser Anda).
- Menolak path traversal pada penyajian berkas statis dan pada endpoint berkas font.
- Batas ukuran permintaan: 1 MB untuk JSON, 128 MB untuk unggahan font.

### Operasi sistem

- Semua perubahan berkas/registri dijalankan oleh skrip PowerShell yang **dibuat aplikasi**
  dengan argumen di-quote; nama nilai registri diperlakukan persis (tanpa wildcard).
- Operasi pada `C:\Windows\Fonts` atau kunci HKLM memerlukan elevasi UAC. Jika ditolak, tidak ada
  perubahan yang dilakukan.
- Penghapusan mencadangkan berkas terlebih dahulu; kegagalan pencadangan membatalkan penghapusan.
- Font inti Windows ditandai dan memerlukan konfirmasi tambahan.

### Host desktop (WebView2)

- Profil WebView2 terpisah (`%LOCALAPPDATA%\FontManager\WebView2`), tidak mewarisi profil atau
  ekstensi browser pribadi.
- Ekstensi dan DevTools dimatikan; navigasi dibatasi ke `http://127.0.0.1:<port>` aplikasi.
- Tautan eksternal dibuka di browser default, bukan di dalam jendela aplikasi.

### Data & privasi

- Tidak ada telemetri, akun, atau koneksi internet. Aplikasi tidak mengirim data ke mana pun.
- Data tersimpan lokal: `data/tracked.json`, `data/backups.json`, `data/backups/`, dan
  `%LOCALAPPDATA%\FontManager\error.log`.
- Berkas cadangan berisi salinan font Anda — perlakukan folder `data/` sebagai data pribadi dan
  jangan di-commit (sudah ada di `.gitignore`).
- Font Adobe Fonts tetap milik Adobe dan tunduk pada lisensi langganan Anda.

## Di luar cakupan

- Kerentanan pada Windows, Node.js, WebView2 Runtime, atau aplikasi Creative Cloud (laporkan ke
  vendor masing-masing).
- Serangan yang membutuhkan akses fisik atau hak Administrator pada mesin yang sama.
- Berkas font berbahaya: parser hanya membaca tabel metadata, tetapi berkas dari sumber tidak
  tepercaya tetap sebaiknya diperiksa lebih dulu.
