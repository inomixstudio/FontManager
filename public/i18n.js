'use strict';

/*
 * Terjemahan antarmuka Font Manager.
 *
 * Kunci kamus adalah frasa bahasa Indonesia seperti yang dipakai di kode dan
 * di markup, sehingga teks sumber tetap terlihat langsung di tempat pemakaian
 * dan tidak ada lapisan nama kunci kedua yang bisa menyimpang. Bahasa Inggris
 * hanya berisi padanan; bahasa laine hari cukup menambahkan kamus baru.
 *
 * Teks dinamis memakai pola {nama} lalu diteruskan lewat tp().
 */
(function (root) {
  const EN = {
    /* --------------------------------------------------------- umum */
    'baru saja': 'just now',
    'Tutup': 'Close',
    'Batal': 'Cancel',
    'Lanjutkan': 'Continue',
    'Selesai': 'Done',
    'Gagal': 'Failed',
    'Pilih': 'Select',
    'Keluar': 'Exit',
    'Ya': 'Yes',
    'Tidak': 'No',
    'Oke': 'OK',

    /* --------------------------------------------------------- sumber */
    'Sistem': 'System',
    'Pengguna': 'User',
    'Kustom': 'Custom',
    'Adobe Fonts': 'Adobe Fonts',
    'Tidak terdeteksi': 'Not detected',

    /* ------------------------------------------------------------ view */
    'Semua keluarga font': 'All font families',
    'Berkas font digabungkan per keluarga agar setiap gaya tampil dalam satu kartu':
      'Font files are grouped by family so every style appears in one card',
    'Font sistem': 'System fonts',
    'Keluarga font yang terpasang untuk semua pengguna Windows':
      'Font families installed for all Windows users',
    'Font pengguna': 'User fonts',
    'Keluarga font yang terpasang khusus untuk akun Anda':
      'Font families installed only for your account',
    'Font kustom': 'Custom fonts',
    'Keluarga font dari folder tambahan di luar folder font Windows':
      'Font families from additional folders outside the Windows font folders',
    'Font Adobe': 'Adobe fonts',
    'Font langganan Adobe Fonts yang aktif di Creative Cloud':
      'Active Adobe Fonts subscription fonts from Creative Cloud',
    'Dilacak': 'Tracked',
    'Keluarga font yang Anda tandai untuk dipantau':
      'Font families you marked to watch',
    'Entri bermasalah': 'Problem entries',
    'Keluarga dengan berkas hilang atau entri registri menggantung':
      'Families with missing files or dangling registry entries',
    'Cadangan': 'Backups',
    'Pengaturan': 'Settings',
    'Menu': 'Menu',
    'Bahasa': 'Language',
    'Bahasa antarmuka': 'Interface language',

    /* ------------------------------------------------------- pratinjau */
    'Pratinjau tidak tersedia': 'Preview unavailable',
    'Pratinjau nama font': 'Font name preview',
    'Font tanpa nama': 'Unnamed font',
    'Tidak diketahui': 'Unknown',
    'Regular': 'Regular',
    'Berkas font ini tidak tersedia untuk pratinjau.':
      'This font file is not available for preview.',
    'Browser tidak dapat memuat pratinjau berkas font ini.':
      'The browser could not load a preview of this font file.',
    'Berkas ini tidak dapat dipratinjau.': 'This file cannot be previewed.',

    /* ---------------------------------------------------- progres tugas */
    'Menunggu': 'Waiting',
    'Memproses…': 'Processing…',
    'Menyiapkan…': 'Preparing…',
    'Mencadangkan…': 'Backing up…',
    'Menghapus…': 'Deleting…',
    'Memulihkan…': 'Restoring…',
    'Memasang…': 'Installing…',
    'Mengunggah…': 'Uploading…',
    'Terpasang': 'Installed',
    'Dihapus': 'Deleted',
    'Dibersihkan': 'Cleaned',
    'Dipulihkan': 'Restored',
    'Sebagian gagal…': 'Some failed…',
    'Tercadangkan': 'Backed up',
    'Tanpa cadangan': 'No backup',
    'Entri registri': 'Registry entry',
    'Proses font masih berjalan di latar. Tunggu sampai selesai sebelum memulai operasi lain.':
      'A font operation is still running in the background. Wait for it to finish before starting another.',
    'Proses font sedang berjalan di panel progres. Selesaikan atau sembunyikan panelnya.':
      'A font operation is running in the progress panel. Finish it or hide the panel.',
    'Proses font sedang berjalan — klik untuk melihat progresnya.':
      'A font operation is running — click to see its progress.',
    'Memproses font': 'Processing fonts',
    'Sembunyikan': 'Hide',
    'Tutup panel': 'Close panel',
    '+{count} berkas lainnya': '+{count} more files',
    '{done} / {total}': '{done} / {total}',

    /* --------------------------------------------------------- daftar */
    '0 keluarga': '0 families',
    'keluarga': 'families',
    'berkas': 'files',
    'Muat lebih banyak — {count} keluarga tersisa': 'Load more — {count} families left',
    'Tidak ada hasil untuk “{query}”': 'No results for “{query}”',
    'Coba kata kunci lain, atau hapus filter pencarian.':
      'Try another keyword, or clear the search filter.',
    'Hapus pencarian': 'Clear search',
    'Belum ada keluarga dilacak': 'No tracked families yet',
    'Tekan ikon bintang pada kartu font untuk menandai seluruh keluarga dan memantaunya dari sini.':
      'Press the star icon on a font card to track the whole family and monitor it here.',
    'Tidak ada entri bermasalah': 'No problem entries',
    'Semua berkas font dan entri registri dalam kondisi baik.':
      'All font files and registry entries are healthy.',
    'Tidak ada font kustom': 'No custom fonts',
    'Font di luar folder font Windows akan muncul di sini.':
      'Fonts outside the Windows font folders will appear here.',
    'Tidak ada font Adobe': 'No Adobe fonts',
    'Font langganan Adobe Fonts yang aktif di Creative Cloud akan muncul di sini.':
      'Active Adobe Fonts subscription fonts will appear here.',
    'Tidak ada font sistem': 'No system fonts',
    'Tidak ada font pengguna': 'No user fonts',
    'Coba pindai ulang untuk memperbarui daftar font.':
      'Try scanning again to refresh the font list.',
    'Pindai ulang': 'Scan again',
    'Tidak ada font terdeteksi': 'No fonts detected',
    'Aplikasi tidak menemukan berkas font di folder Windows. Coba pindai ulang.':
      'The app did not find font files in the Windows folders. Try scanning again.',
    'Cari keluarga, gaya, atau berkas…': 'Search families, styles, or files…',
    'Cari font': 'Search fonts',
    'Teks pratinjau': 'Preview text',
    'Kosongkan untuk memakai nama font': 'Leave empty to use the font name',
    'Ukuran': 'Size',
    'Urutkan': 'Sort',
    'Nama font': 'Font name',
    'Ukuran terbesar': 'Largest size',
    'Terbaru diubah': 'Recently changed',
    'Ketebalan': 'Weight',
    'Tambah font': 'Add font',
    'Pasang berkas font baru': 'Install new font files',
    'Pindai ulang semua font': 'Scan all fonts again',
    'Pilih beberapa keluarga font untuk dihapus':
      'Select several font families to delete',
    'Terakhir dipindai {time} · {count} keluarga': 'Last scanned {time} · {count} families',
    'keluarga font': 'font families',

    /* -------------------------------------------------------- pilihan */
    'Tidak ada keluarga baru yang dipilih': 'No new families selected',
    'Tidak ada hasil untuk dipilih.': 'There are no results to select.',
    'Selesai memilih': 'Finish selecting',
    'Pilih keluarga yang akan dihapus': 'Select the families to delete',
    'Hapus terpilih': 'Delete selected',
    'Cadangkan terpilih': 'Back up selected',
    'Cadangkan {count} berkas': 'Back up {count} files',
    'Pilih tampil': 'Select visible',
    'Pilih semua hasil': 'Select all results',
    'Kosongkan': 'Clear',
    'Pilih {count} berkas': 'Delete {count} files',
    'Pilih semua hasil ({count})': 'Select all results ({count})',
    'Pilih semua hasil; maksimal {count} berkas per operasi':
      'Select all results; at most {count} files per operation',
    'Pilih tampil ({count})': 'Select visible ({count})',
    'Pilih keluarga yang sedang tampil; maksimal {count} berkas':
      'Select the families currently shown; at most {count} files',
    'Tandai untuk dihapus': 'Mark for deletion',
    'Batas {count} berkas per operasi. Hapus pilihan saat ini dulu.':
      'Limit of {count} files per operation. Delete the current selection first.',
    'batas {count} berkas tercapai': 'limit of {count} files reached',
    ' · {count} inti sistem': ' · {count} system core',
    'Keluarga {name} — {count} berkas': 'Family {name} — {count} files',
    'Pilih {name} untuk dihapus': 'Select {name} for deletion',
    'Pilihan melebihi batas {count} berkas. Kurangi pilihan terlebih dahulu.':
      'Selection exceeds the limit of {count} files. Reduce the selection first.',

    /* ----------------------------------------------------- kartu font */
    'Variabel': 'Variable',
    'Koleksi': 'Collection',
    'Inti sistem': 'System core',
    'Belum terdaftar': 'Not registered',
    'Lihat semua gaya': 'View all styles',
    'Detail': 'Details',
    'Buka folder font': 'Open font folder',
    'Folder': 'Folder',
    'Hapus keluarga font': 'Delete font family',
    'Hapus': 'Delete',
    'Berkas tidak terdeteksi — hentikan pelacakan dari kartu ini':
      'File not detected — stop tracking from this card',
    'Hentikan pelacakan keluarga ini': 'Stop tracking this family',
    'Lepas': 'Untrack',
    'Pilih gaya untuk pratinjau ({count})': 'Choose a style to preview ({count})',
    'Lacak keluarga': 'Track family',
    'Buka folder': 'Open folder',
    'Buka folder cadangan font': 'Open backed-up fonts folder',
    'Folder cadangan font dibuka di Explorer.': 'Backed-up fonts folder opened in Explorer.',
    'Hapus keluarga': 'Delete family',

    /* ----------------------------------------------- detail keluarga */
    'Tutup detail': 'Close details',
    'Keluarga ini berisi font inti Windows. Menghapusnya dapat membuat antarmuka Windows tidak terbaca.':
      'This family contains Windows core fonts. Deleting it can make the Windows interface unreadable.',
    'Sebagian berkas ada di folder font tetapi belum terdaftar di registri Windows.':
      'Some files are in the font folder but not yet registered in the Windows registry.',
    'Keluarga': 'Family',
    'Jumlah berkas': 'File count',
    'Gaya': 'Style',
    'Total ukuran': 'Total size',
    'Sumber': 'Source',
    'Format': 'Format',
    'Status': 'Status',
    'Semua berkas hilang': 'All files missing',
    'Semua berkas tersedia': 'All files available',
    'Tautan': 'Link',
    'Lihat di fonts.adobe.com': 'View on fonts.adobe.com',
    'Informasi keluarga': 'Family information',
    'Berkas dalam keluarga ({count})': 'Files in the family ({count})',
    'Detail {name}': 'Details {name}',
    'Buka folder {name}': 'Open folder {name}',
    'Hapus {name}': 'Delete {name}',
    'Kembali ke keluarga': 'Back to family',

    /* ------------------------------------------------- detail berkas */
    'Berkas hilang': 'File missing',
    'Lacak font': 'Track font',
    'Hapus berkas': 'Delete file',
    'Font ini termasuk font inti Windows. Menghapusnya dapat membuat antarmuka Windows tidak terbaca.':
      'This is a Windows core font. Deleting it can make the Windows interface unreadable.',
    'Font langganan Adobe Fonts. Menghapus berkas ini mencabut aktivasi lokalnya; aktivasi kembali lewat aplikasi Creative Cloud.':
      'An Adobe Fonts subscription font. Deleting this file revokes its local activation; activate it again through the Creative Cloud app.',
    'Berkas font tidak ditemukan. Anda masih dapat membersihkan entri registrinya.':
      'Font file not found. You can still clean up its registry entry.',
    'Nama lengkap': 'Full name',
    'Berat': 'Weight',
    'Jenis berkas': 'File type',
    'Diubah': 'Modified',
    'Hak sematan': 'Embedding rights',
    'Tidak terdeteksi saat pindai terakhir': 'Not detected in the last scan',
    'Aktif via Adobe Creative Cloud': 'Active via Adobe Creative Cloud',
    'Terdaftar di registri': 'Registered in the registry',
    'Tidak terdaftar': 'Not registered',
    'Ya — mendukung beberapa ketebalan': 'Yes — supports multiple weights',
    'Wajah dalam koleksi': 'Faces in collection',
    'Informasi font': 'Font information',
    'Lokasi berkas': 'File location',
    'Salin path': 'Copy path',
    'Path disalin ke papan klip.': 'Path copied to the clipboard.',
    'Gagal menyalin path.': 'Could not copy the path.',
    'Folder font dibuka di Explorer.': 'Font folder opened in Explorer.',
    'Gagal membuka folder: {error}': 'Could not open folder: {error}',
    'Wajah font dalam berkas': 'Font faces in file',
    'Entri registri': 'Registry entries',
    'Memuat detail registri…': 'Loading registry details…',
    'HKLM · semua pengguna': 'HKLM · all users',
    'HKCU · akun ini': 'HKCU · this account',
    'Tidak ada entri registri untuk berkas ini.': 'No registry entries for this file.',
    'Detail registri tidak tersedia.': 'Registry details unavailable.',
    'Hentikan pelacakan keluarga': 'Stop tracking family',
    'Lacak semua gaya dalam keluarga': 'Track all styles in the family',
    'Pelacakan {name} dihentikan.': 'Tracking for {name} stopped.',
    'Gagal memperbarui pelacakan: {error}': 'Could not update tracking: {error}',

    /* ------------------------------------------------------ konfirmasi */
    'Berkas font sudah tidak ada. Tindakan ini hanya membersihkan entri registri yang tersisa.':
      'The font file no longer exists. This action only cleans up the remaining registry entry.',
    'Font ini termasuk font inti Windows. Menghapusnya dapat membuat teks antarmuka, menu, atau pengaturan tidak terbaca. Hanya lanjutkan jika Anda benar-benar yakin.':
      'This is a Windows core font. Deleting it can make interface text, menus, or settings unreadable. Continue only if you are certain.',
    'Cadangkan berkas font sebelum dihapus (dapat dipulihkan dari tab Cadangan).':
      'Back up font files before deleting (can be restored from the Backups tab).',
    'Font sistem memerlukan izin Administrator. Jendela UAC akan muncul — setujui untuk melanjutkan.':
      'System fonts need Administrator permission. A UAC prompt will appear — approve it to continue.',
    'Saya mengerti risikonya dan tetap ingin menghapus font ini.':
      'I understand the risk and still want to delete this font.',
    'Hapus font': 'Delete font',
    'Bersihkan entri': 'Clean entry',
    'Hapus font ini?': 'Delete this font?',
    'Bersihkan entri registri?': 'Clean the registry entry?',
    'Font akan dihapus dari Windows. Cadangan disimpan secara lokal agar bisa dipulihkan.':
      'The font will be deleted from Windows. A backup is kept locally so it can be restored.',
    'Entri registri akan dihapus tanpa menyentuh berkas lain.':
      'The registry entry will be removed without touching other files.',
    'Jika jendela UAC muncul, setujui untuk melanjutkan.':
      'If a UAC prompt appears, approve it to continue.',
    '{count} berkas': '{count} files',
    'Penghapusan selesai': 'Deletion finished',
    'Daftar font sudah diperbarui.': 'Font list updated.',
    'Penghapusan dibatalkan; tidak ada perubahan.':
      'Deletion canceled; nothing was changed.',
    'Penghapusan dibatalkan.': 'Deletion canceled.',
    'Penghapusan tidak selesai': 'Deletion incomplete',
    'Kesalahan tidak diketahui.': 'Unknown error.',
    'Penghapusan tidak selesai: {error}': 'Deletion incomplete: {error}',
    'kesalahan tidak diketahui': 'unknown error',
    'Gagal menghapus': 'Could not delete',
    'Tidak ada perubahan yang dikonfirmasi server.':
      'The server confirmed no changes.',
    'Gagal menghapus font: {error}': 'Could not delete font: {error}',
    'Keluarga ini berisi font inti Windows. Menghapus seluruh keluarga dapat membuat teks antarmuka Windows tidak terbaca.':
      'This family contains Windows core fonts. Deleting the whole family can make Windows interface text unreadable.',
    'Semua berkas dihapus dalam satu operasi. Jika ada font sistem, satu jendela UAC akan muncul.':
      'All files are deleted in one operation. If there are system fonts, a single UAC prompt will appear.',
    'Saya mengerti risikonya dan tetap ingin menghapus seluruh keluarga ini.':
      'I understand the risk and still want to delete this entire family.',
    'Seluruh berkas dan entri registri keluarga ini akan dihapus dari Windows.':
      'All files and registry entries of this family will be deleted from Windows.',
    'Jangan tutup jendela. Jika jendela UAC muncul, setujui untuk melanjutkan.':
      'Do not close the window. If a UAC prompt appears, approve it to continue.',
    'Cadangkan {count} berkas sebelum dihapus (satu operasi, dapat dipulihkan dari tab Cadangan).':
      'Back up {count} files before deleting (one operation, can be restored from the Backups tab).',
    'Hapus {count} berkas': 'Delete {count} files',
    'Hapus keluarga {name}?': 'Delete family {name}?',
    'Menghapus {name}': 'Deleting {name}',
    'Membersihkan {name}': 'Cleaning {name}',
    ' · {count} cadangan tersimpan': ' · {count} backups saved',
    'Bersihkan {count} entri': 'Clean {count} entries',
    'Bersihkan entri {name}?': 'Clean entries for {name}?',
    'Tidak ada berkas yang tersisa di disk; hanya entri registri yang akan dibersihkan.':
      'No files remain on disk; only registry entries will be cleaned.',
    'Tidak ada berkas tersisa di disk; hanya entri registri yang akan dibersihkan.':
      'No files remain on disk; only registry entries will be cleaned.',
    'Pembersihan selesai': 'Cleanup finished',
    'Pembersihan dibatalkan.': 'Cleanup canceled.',
    'Pembersihan tidak selesai': 'Cleanup incomplete',
    'Pembersihan tidak selesai: {error}': 'Cleanup incomplete: {error}',
    'Gagal membersihkan': 'Could not clean',
    'Gagal membersihkan entri: {error}': 'Could not clean entries: {error}',
    'Semua pilihan dihapus dalam satu operasi. Jika ada font sistem, satu jendela UAC akan muncul.':
      'All selected items are deleted in one operation. If there are system fonts, a single UAC prompt will appear.',
    'Saya mengerti risikonya dan tetap ingin menghapus keluarga inti sistem yang dipilih.':
      'I understand the risk and still want to delete the selected system core families.',
    'Seluruh berkas dan entri registri dari keluarga yang dipilih akan dihapus dari Windows.':
      'All files and registry entries of the selected families will be deleted from Windows.',
    'Tidak ada berkas yang tersisa; hanya entri registri yang akan dibersihkan.':
      'No files remain; only registry entries will be cleaned.',
    'Satu operasi untuk semua pilihan. Jika jendela UAC muncul, setujui untuk melanjutkan.':
      'One operation for everything selected. If a UAC prompt appears, approve it to continue.',
    'Operasi selesai': 'Operation finished',
    'Daftar font dan cadangan sudah diperbarui.': 'Font list and backups updated.',
    'Sebagian berkas mungkin sudah berubah. Pindai ulang untuk memastikan.':
      'Some files may already have changed. Scan again to confirm.',
    'Tidak ada berkas yang dihapus.': 'No files were deleted.',
    'Gagal menghapus keluarga font: {error}': 'Could not delete font family: {error}',
    '+{count} keluarga lainnya': '+{count} more families',
    'Hapus {count} keluarga terpilih?': 'Delete {count} selected families?',
    'Bersihkan {count} keluarga terpilih?': 'Clean {count} selected families?',
    'Menghapus {count} keluarga': 'Deleting {count} families',
    'Membersihkan {count} keluarga': 'Cleaning {count} families',
    'Pindai ulang untuk melihat kondisi terakhir.':
      'Scan again to see the latest state.',
    'Gagal menghapus font terpilih: {error}': 'Could not delete selected fonts: {error}',

    /* ----------------------------------------------------- pemasangan */
    'Koneksi ke server terputus.': 'Connection to the server was lost.',
    'Pemasangan dibatalkan.': 'Installation canceled.',
    'Berkas dipasang satu per satu untuk akun Anda.':
      'Files are installed one at a time for your account.',
    'Biarkan jendela ini terbuka sampai pemasangan selesai.':
      'Keep this window open until installation finishes.',
    'Memasang {count} font': 'Installing {count} fonts',
    '0 / {count}': '0 / {count}',
    'Memasang {done}/{total}: {name}': 'Installing {done}/{total}: {name}',
    'Mengunggah {percent}%': 'Uploading {percent}%',
    'Pemasangan selesai dengan catatan': 'Installation finished with notes',
    'Pemasangan selesai': 'Installation finished',
    'Gagal: {error}': 'Failed: {error}',

    /* ------------------------------------------------------- cadangan */
    'Gagal memuat': 'Could not load',
    'Gagal memuat cadangan': 'Could not load backups',
    'Coba lagi': 'Try again',
    'Cadangan font': 'Font backups',
    'Salinan font yang dihapus — dapat dipulihkan kapan saja':
      'Copies of deleted fonts — restorable at any time',
    'Memuat…': 'Loading…',
    '0 cadangan': '0 backups',
    'Belum ada cadangan': 'No backups yet',
    'Font yang dihapus otomatis disalin ke folder cadangan, dan Anda juga bisa mencadangkan font kapan saja dengan tombol Cadangkan.':
      'Deleted fonts are copied to the backup folder automatically, and you can also back up any font at any time with the Back up button.',
    'Cadangkan': 'Back up',
    'Manual': 'Manual',
    'Simpan salinan cadangan font ini': 'Save a backup copy of this font',
    'Cadangkan semua berkas Adobe Fonts dalam famili ini':
      'Back up all Adobe Fonts files in this family',
    'Tidak ada berkas font yang dapat dicadangkan.':
      'There is no font file that can be backed up.',
    '{count} font dicadangkan.': '{count} fonts backed up.',
    '{count} font gagal dicadangkan.': '{count} fonts could not be backed up.',
    'Gagal mencadangkan font: {error}': 'Could not back up font: {error}',
    'Pulihkan': 'Restore',
    'Hapus cadangan permanen': 'Delete backup permanently',
    'berkas cadangan hilang': 'backup file missing',
    'Berkas cadangan dikembalikan ke lokasi aslinya. Jika jendela UAC muncul, setujui.':
      'The backup file is returned to its original location. If a UAC prompt appears, approve it.',
    'Pemulihan selesai': 'Restore finished',
    'Pemulihan sebagian': 'Restore partially finished',
    'Gunakan Pindai untuk memeriksa status font.':
      'Use Scan to check the font status.',
    'Pemulihan dibatalkan.': 'Restore canceled.',
    'Pemulihan tidak selesai': 'Restore incomplete',
    'Pemulihan tidak selesai: {error}': 'Restore incomplete: {error}',
    'Gagal memulihkan': 'Could not restore',
    'Gagal memulihkan font: {error}': 'Could not restore font: {error}',
    'Hapus cadangan permanen?': 'Delete backup permanently?',
    'Berkas cadangan akan dihapus dari disk.': 'The backup file will be deleted from disk.',
    'Hapus permanen': 'Delete permanently',
    'Menghapus cadangan': 'Deleting backup',
    'Berkas cadangan dihapus permanen dari disk.':
      'The backup file was permanently deleted from disk.',
    'Cadangan dihapus': 'Backup deleted',
    'Cadangan dihapus.': 'Backup deleted.',
    'Gagal menghapus cadangan': 'Could not delete backup',
    'Gagal menghapus cadangan: {error}': 'Could not delete backup: {error}',
    'Cadangan {name} ({size}) akan dihapus dan tidak dapat dipulihkan lagi.':
      'Backup {name} ({size}) will be deleted and cannot be restored again.',
    'Berkas {name} dipulihkan, tetapi pendaftaran registri gagal: {error}':
      'File {name} was restored, but registry registration failed: {error}',
    'Berkas {name} dipulihkan ke folder font pengguna.':
      'File {name} was restored to the user fonts folder.',
    'Berkas asli masih ada, jadi cadangan ini dipulihkan sebagai salinan baru.':
      'The original file still exists, so this backup was restored as a new copy.',
    '{name} dipulihkan sebagai salinan baru di folder font pengguna.':
      '{name} was restored as a new copy in the user fonts folder.',

    /* ---------------------------------------------------- pemindaian */
    'Memindai…': 'Scanning…',
    'Gagal memindai': 'Could not scan',
    'Tidak dapat memindai font': 'Could not scan fonts',
    'Pemindaian gagal: {error}': 'Scan failed: {error}',
    'Memindai ulang font': 'Scan fonts again',
    'Membaca folder font Windows dan registri…':
      'Reading the Windows font folders and registry…',
    'Pemindaian koleksi besar bisa memakan waktu beberapa saat.':
      'Scanning a large collection may take a while.',
    'Folder font sistem': 'System font folder',
    'Folder font pengguna': 'User font folder',
    'Registri font Windows': 'Windows font registry',
    'HKCU / HKLM': 'HKCU / HKLM',
    'Pemindaian selesai': 'Scan finished',
    'Pemindaian gagal': 'Scan failed',
    'Lihat pesan kesalahan di daftar utama.':
      'See the error message in the main list.',
    'Dibatalkan': 'Canceled',

    /* ------------------------------------------- pola teks dinamis */
    '{count} keluarga': '{count} families',
    '{count} berkas hilang': '{count} files missing',
    '{count} keluarga ditambahkan': '{count} families added',
    '{count} keluarga inti sistem dilewati': '{count} system core families skipped',
    '{count} berkas · {size}': '{count} files · {size}',
    '· {count} inti sistem': '· {count} system core',
    '· {count} cadangan tersimpan': '· {count} backups saved',
    'Pratinjau {style} · {file}': 'Preview {style} · {file}',
    'Pratinjau {style}': 'Preview {style}',
    'Memulihkan {name}': 'Restoring {name}',
    '{count} tidak terdeteksi': '{count} not detected',
    'Keluarga {name} — {count} berkas': 'Family {name} — {count} files',
    '{count} hilang': '{count} missing',
    '{name} +{count} berkas': '{name} +{count} files',
    'font sistem': 'system fonts',
    'font pengguna': 'user fonts',
    'Tidak ada {kind}': 'No {kind}',
    'Lihat detail berkas': 'View file details',
    'Hapus berkas ini': 'Delete this file',
    '{name} ditambahkan ke daftar dilacak.': '{name} added to the tracked list.',
    '{name} dilacak — {count} berkas gaya sekaligus.': '{name} tracked — {count} style files at once.',
    '{name}: {count} berkas dihapus': '{name}: {count} files deleted',
    '{name}: {count} berkas dihapus.': '{name}: {count} files deleted.',
    '{count} berkas · menyiapkan cadangan…': '{count} files · preparing backups…',
    '{count} entri': '{count} entries',
    '{count} entri registri': '{count} registry entries',
    'entri registri': 'registry entry',
    '{name}: {count} entri dibersihkan.': '{name}: {count} entries cleaned.',
    '{missing} dari {total} berkas sudah hilang. Entri registrinya tetap dibersihkan.':
      '{missing} of {total} files are already missing. Their registry entries will still be cleaned.',
    '{count} gagal': '{count} failed',
    '{count} berkas dihapus dari {families} keluarga':
      '{count} files deleted from {families} families',
    '{families} keluarga: {count} entri dibersihkan.':
      '{families} families: {count} entries cleaned.',
    '{count} keluarga terpilih': '{count} selected families',
    '{count} gaya': '{count} styles',
    '{families} keluarga · {files} berkas · {size}': '{families} families · {files} files · {size}',
    '{count} cadangan · {size}': '{count} backups · {size}',
    'hilang': 'missing',
    'inti sistem': 'system core',
    'variabel': 'variable',
    '{families} keluarga · {files} berkas': '{families} families · {files} files',
    '{count} keluarga font': '{count} font families',
    'Terakhir dipindai {time} · {count} berkas · {size}':
      'Last scanned {time} · {count} files · {size}',
    'cadangan': 'backup',
    '{name} dihapus permanen.': '{name} was permanently deleted.',
    'Navigasi': 'Navigation',
    'Windows Font Explorer': 'Windows Font Explorer',
    'Menyiapkan pemindaian…': 'Preparing the scan…',
    'Pilih beberapa keluarga font untuk dihapus': 'Select several font families to delete',
    'Pindai ulang semua font': 'Scan all fonts again',
    'Pasang berkas font baru': 'Install new font files',
    'Kosongkan untuk memakai nama font': 'Leave empty to use the font name',
    'Ukuran terbesar': 'Largest size',
    'Terbaru diubah': 'Recently changed',
    'Ketebalan': 'Weight',
    'Muat lebih banyak': 'Load more',
    'Tidak ada font': 'No fonts',
    'Coba kata kunci lain atau ubah filter.': 'Try another keyword or change the filter.',
    'Pilih keluarga yang akan dihapus': 'Select the families to delete',
    'Pilih tampil': 'Select visible',
    'Pilih semua hasil': 'Select all results',
    'Kosongkan': 'Clear',
    'Hapus terpilih': 'Delete selected',
    'Memproses font': 'Processing fonts',
    'Progres operasi': 'Operation progress',
    'Sembunyikan': 'Hide',
    'Lepaskan untuk memasang font': 'Drop to install fonts',
    'Berkas .ttf, .otf, .ttc, dan .otc akan dipasang untuk akun Anda.':
      '.ttf, .otf, .ttc, and .otc files will be installed for your account.',
    'Cadangkan {count} berkas sebelum dihapus (dapat dipulihkan dari tab Cadangan).':
      'Back up {count} files before deleting (can be restored from the Backups tab).',
    'Keluarga font sistem': 'System font families',
    'Keluarga font pengguna': 'User font families',
    'Keluarga font kustom': 'Custom font families',
    'Font langganan Adobe Fonts': 'Adobe Fonts subscription fonts',
    'Font dilacak': 'Tracked fonts',
    'Detail font': 'Font details',
    'Adobe': 'Adobe',
    'Berkas': 'Files',
    'Pindai': 'Scan',
    'Font Manager v{version}': 'Font Manager v{version}',
    'Mempersiapkan aplikasi…': 'Preparing the application…',
    'Memeriksa database…': 'Checking the database…',
    'Menyiapkan skema dan data awal…': 'Preparing schema and initial data…',
    'Menyiapkan jendela login…': 'Preparing the login window…',
    'Memindai folder font…': 'Scanning font folders…',
    'Membaca registri Windows…': 'Reading the Windows registry…',
    'Membaca metadata font…': 'Reading font metadata…',
    'Menambahkan font Adobe Fonts…': 'Adding Adobe Fonts…',
    'Menyusun tampilan…': 'Building the view…',
    'Pilih berkas font .ttf, .otf, .ttc, atau .otc.': 'Choose .ttf, .otf, .ttc, or .otc font files.',
    '{ok} berhasil · {failed} gagal dipasang.': '{ok} succeeded · {failed} failed to install.',
    '{count} font berhasil dipasang untuk akun Anda.': '{count} fonts were installed for your account.',
    '{count} berkas dilewati karena formatnya tidak didukung.':
      '{count} files were skipped because their format is not supported.',
    '{count} berkas gagal dipasang — {detail}': '{count} files failed to install — {detail}',
    'Berkas {name} dipulihkan, tetapi pendaftaran registri gagal: {error}.':
      'File {name} was restored, but registry registration failed: {error}.'
  };

  let current = 'id';

  function normalizeLang(value) {
    return String(value || '').toLowerCase().startsWith('en') ? 'en' : 'id';
  }

  function detectLang() {
    if (typeof document === 'undefined') return 'id';
    try {
      const saved = root.localStorage && root.localStorage.getItem('fm:lang');
      if (saved) return normalizeLang(saved);
    } catch {
      /* localStorage boleh tidak tersedia */
    }
    return 'id';
  }

  function translate(text) {
    const value = String(text == null ? '' : text);
    if (current !== 'en') return value;
    return Object.prototype.hasOwnProperty.call(EN, value) ? EN[value] : value;
  }

  function t(text) {
    return translate(text);
  }

  function tp(text, vars) {
    const pattern = translate(text);
    if (!vars) return pattern;
    return pattern.replace(/\{(\w+)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
    );
  }

  function setLanguage(lang) {
    current = normalizeLang(lang);
    if (typeof document !== 'undefined') {
      try {
        if (root.localStorage) root.localStorage.setItem('fm:lang', current);
      } catch {
        /* abaikan */
      }
    }
    return current;
  }

  function getLanguage() {
    return current;
  }

  function localeTag() {
    return current === 'en' ? 'en-US' : 'id-ID';
  }

  /*
   * Terapkan terjemahan ke markup statis. Atribut dipasang di index.html:
   * data-i18n (teks), data-i18n-title, data-i18n-placeholder,
   * data-i18n-aria-label, dan data-i18n-html.
   */
  function applyStatic(rootNode = null) {
    const scope = rootNode || (typeof document !== 'undefined' ? document : null);
    if (!scope || !scope.querySelectorAll) return;
    for (const node of scope.querySelectorAll('[data-i18n]')) {
      node.textContent = translate(node.getAttribute('data-i18n'));
    }
    for (const attr of ['title', 'placeholder', 'aria-label']) {
      for (const node of scope.querySelectorAll(`[data-i18n-${attr}]`)) {
        node.setAttribute(attr, translate(node.getAttribute(`data-i18n-${attr}`)));
      }
    }
  }

  const api = {
    t,
    tp,
    translate,
    setLanguage,
    getLanguage,
    localeTag,
    applyStatic,
    STRINGS: EN
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.I18N = api;
})(typeof window !== 'undefined' ? window : globalThis);
