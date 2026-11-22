# Font Manager

Aplikasi manajer font lokal untuk Windows. Aplikasi memindai seluruh font yang
terinstal, menampilkan pratinjau asli setiap font, menyimpan daftar font yang
Anda lacak, dan menghapus font dengan aman (cadangan otomatis).

Berjalan lokal di komputer ini (`127.0.0.1`) dalam jendela desktop mandiri.
Shell desktop memakai WebView2 Runtime Windows dengan profil terpisah dan
ekstensi browser dinonaktifkan; UI tetap ringan tanpa mengemas browser penuh.

## Fitur

- **Deteksi font terinstal** — membaca registri Windows (HKLM + HKCU) dan folder
  font sistem/pengguna, termasuk berkas font yang belum terdaftar.
- **Satu kartu per keluarga** — seluruh berkas dengan keluarga yang sama
  (Regular, Bold, Italic, Light, dan seterusnya) digabung menjadi satu kartu,
  termasuk koleksi TTC/OTC. Nama keluarga yang terpecah seperti
  `Acre-Black`, `AmlightSemiBold`, atau `FilsonProBlack` dikenali sebagai gaya
  dari keluarga yang sama. Varian lebar/desain yang memang berbeda (mis.
  `Geologica Roman`, `Barlow Condensed`) tetap berdiri sendiri agar tidak
  salah gabung.
- **Pratinjau langsung** — setiap kartu dirender memakai berkas font aslinya
  dan menampilkan nama font itu sendiri. Teks kustom tetap bisa diisi lewat
  kolom **Teks pratinjau** (kosongkan untuk kembali ke nama font).
- **Pencarian & filter** — cari berdasarkan nama keluarga, nama berkas, atau
  gaya; filter Semua / Sistem / Pengguna / Kustom / Adobe.
- **Detail font** — nama lengkap, PostScript, berat, hak sematan, wajah di dalam
  koleksi (TTC/OTC), entri registri, lokasi berkas, dan tombol buka Explorer.
- **Font dilacak** — tandai seluruh keluarga dengan satu klik bintang; semua
  gaya di dalamnya ikut dilacak. Daftar disimpan permanen di
  `data/tracked.json` dan ditampilkan pada tab **Dilacak**.
- **Hapus per keluarga** — hapus semua berkas dan entri registri satu keluarga
  dalam satu operasi, atau buka detail untuk menghapus satu berkas saja. Font
  sistem memakai elevasi UAC dan font inti Windows butuh konfirmasi khusus.
- **Pilih & hapus massal** — aktifkan **Pilih**, tandai beberapa keluarga, lalu
  **Hapus terpilih**. Semua pilihan diproses dalam satu operasi (satu UAC bila
  ada font sistem), dengan cadangan otomatis. Maksimal 2.000 berkas per
  operasi; **Pilih semua hasil** melewati font inti sistem secara otomatis.
- **Dukungan Adobe Fonts** — font langganan Adobe Fonts yang aktif di
  Creative Cloud terdeteksi otomatis dari folder sinkronisasi CoreSync,
  lengkap dengan tautan ke fonts.adobe.com. Dapat dilacak, dicadangkan, dan
  dihapus; penghapusan ikut mencabut entri entitlement agar Creative Cloud
  tidak mengunduhnya kembali, dan pemulihan dari cadangan mendaftarkannya
  kembali. Untuk berhenti berlangganan sebuah keluarga secara permanen,
  tetap gunakan aplikasi Creative Cloud. ID font Adobe memakai id sinkronisasi
  (bukan path), sehingga pelacakan tetap utuh meski Creative Cloud memindahkan
  berkasnya antar subfolder.
- **Pelacakan tidak pernah hilang** — keluarga yang dilacak tetap tampil di tab
  **Dilacak** walau berkasnya sedang tidak terdeteksi (dipindah/dihapus), dengan
  chip **tidak terdeteksi** dan tombol **Lepas** untuk menghentikan pelacakan.
- **Cadangan & pemulihan** — setiap penghapusan mencadangkan berkas lebih dulu
  ke `data/backups`; pulihkan kapan saja dari tab **Cadangan**.
- **Tambah font** — pasang berkas `.ttf`, `.otf`, `.ttc`, atau `.otc` untuk akun
  Anda (tanpa hak administrator), lewat tombol atau seret-lepas ke jendela.
- **Pemindaian besar** — daftar dirender bertahap (60 per halaman) sehingga
  koleksi berisi puluhan ribu font tetap lancar.
- **Penggabungan pola nama lama** — keluarga yang menaruh berat/lebar di nama
  (mis. "Franklin Gothic Book/Demi/Heavy/Medium" atau "Futura Bk BT/Md BT")
  digabung menjadi satu keluarga dengan label gaya yang tetap membedakan
  "Bold" dan "Bold Condensed". Varian desain seperti Cond/Narrow/Extended
  tetap terpisah.

## Menjalankan

1. Pastikan **Node.js 18+** dan **Microsoft Edge WebView2 Runtime** tersedia.
2. Klik dua kali **`start.bat`**. Peluncur membuka jendela desktop Font Manager;
   pertama kali aplikasi membuat host desktop (beserta ikonnya) bila belum
   tersedia.
3. UI dan server berjalan lokal di `127.0.0.1`. Host menyalakan server saat
   dibuka dan menghentikannya ketika jendela ditutup. Selama server disiapkan,
   jendela menampilkan status "Menyiapkan Font Manager…".
4. Menjalankan `start.bat` lagi tidak membuka jendela kedua: instans yang sudah
   berjalan diaktifkan kembali.

Tidak ada `npm install` atau unduhan paket saat menjalankan aplikasi. Runtime
WebView2 memakai profil khusus Font Manager, tidak mewarisi ekstensi maupun
profil browser pribadi, dan menonaktifkan ekstensi serta DevTools.

## Cara pakai singkat

- **Cari font**: ketik di kolom pencarian, atau tekan `/`. Pencarian juga bisa
  dibuka langsung lewat alamat `?q=futura` (mis. dari tautan atau shortcut).
- **Ubah pratinjau**: kosongkan kolom teks untuk memakai nama font, isi teks
  kustom bila perlu, lalu geser slider ukuran.
- **Lihat detail**: klik kartu untuk melihat seluruh gaya dalam keluarga;
  klik salah satu berkas untuk detail registri dan path-nya.
- **Lacak**: klik ikon bintang pada kartu/keluarga; semua gaya ikut dilacak.
- **Hapus**: tombol **Hapus** pada kartu menghapus seluruh keluarga; gunakan
  detail berkas untuk menghapus satu gaya saja. Font sistem memunculkan UAC.
- **Hapus massal**: klik **Pilih** di toolbar, klik kartu untuk menandainya,
  lalu **Hapus N berkas** pada bilah pilihan. Gunakan **Pilih semua hasil** atau
  **Pilih tampil** untuk memilih banyak keluarga sekaligus.
- **Pulihkan**: tab **Cadangan** → **Pulihkan**.
- **Pasang font baru**: **Tambah font** atau seret berkas ke jendela. Panel
  progres menampilkan setiap berkas (mengunggah → memasang → terpasang).
- **Pantau proses hapus/pasang**: setiap operasi menampilkan panel progres berisi
  nama berkas/keluarga yang sedang diproses, persentase, dan ringkasan hasil
  ("selesai", "dibatalkan", atau "gagal") sebelum panel ditutup.
  - Saat **menghapus**, status tiap berkas diperbarui **langsung**
    (Menunggu → Tercadangkan → Menghapus… → Dihapus) dengan nama berkas yang
    sedang diproses, termasuk saat hapus massal (per keluarga).
  - Operasi lain yang menggunakan panel: **pulihkan cadangan**, **hapus
    cadangan**, dan **pindai ulang**.
  - Tekan **Sembunyikan** (atau Esc) untuk menutup panel sementara proses
    berjalan di latar; toast "Proses font sedang berjalan" muncul dan dapat
    diklik untuk menampilkan panel kembali.
  - Selama proses berjalan, operasi lain (pasang/hapus/pulihkan) ditolak
    dengan pesan — tidak ada yang terkunci tanpa keterangan.

## Izin administrator (UAC)

- Font **pengguna** (`%LOCALAPPDATA%\Microsoft\Windows\Fonts`, kunci HKCU) dapat
  dihapus/dipasang tanpa UAC.
- Font **sistem** (`C:\Windows\Fonts`, kunci HKLM) memerlukan izin
  Administrator. Aplikasi menjalankan skrip PowerShell yang dielevasi; jendela
  UAC akan muncul. Jika Anda menolak, tidak ada perubahan yang dilakukan.

## Penyimpanan data

| Lokasi | Isi |
| --- | --- |
| `data/tracked.json` | Daftar font yang dilacak |
| `data/backups.json` | Indeks cadangan font |
| `data/backups/` | Salinan berkas font yang dihapus |

Folder `data/` dibuat otomatis dan tidak perlu di-commit.

## Catatan & batasan

- Font inti sistem (mis. Segoe UI, Segoe UI Emoji, Marlett) ditandai
  **Inti sistem**; penghapusannya butuh centang konfirmasi dan sangat tidak
  disarankan.
- Sebagian aplikasi yang sedang berjalan baru melihat font yang baru dipasang
  atau dihapus setelah dimulai ulang.
- Berkas `.fon`, `.fnt`, `.pfb`, dan `.pfm` terdeteksi tetapi tidak dapat
  dipratinjau di jendela aplikasi.
- Font dengan berkas hilang tetap muncul di tab **Entri bermasalah** dan dapat
  dibersihkan entri registrinya.
- Server hanya mendengarkan `127.0.0.1` dan menolak permintaan lintas asal
  (CSRF), sehingga aplikasi web lain tidak dapat memicu penghapusan font.
- Font Adobe yang dihapus tetap milik langganan Anda; aktifkan kembali
  kapan saja dari aplikasi Creative Cloud atau dari tab **Cadangan**.

## Struktur

```
server.js              Server HTTP + API (tanpa dependensi eksternal)
desktop/                Host WinForms ringan + WebView2 Runtime
desktop/make-icon.ps1   Pembuat ikon aplikasi (app.ico) dari geometri logo
lib/fontParser.js      Pembaca tabel sfnt (name, OS/2, head, TTC)
lib/registry.js        Pembacaan registri font Windows
lib/scanner.js         Pemindaian folder + registri, cache metadata
lib/adobeFonts.js      Dukungan font langganan Adobe Fonts (CoreSync)
lib/manage.js          Hapus/pasang/pulihkan + skrip PowerShell & UAC
lib/store.js           Penyimpanan lacak & cadangan
public/                Antarmuka (HTML, CSS, JS)
start.bat              Peluncur Windows
```
