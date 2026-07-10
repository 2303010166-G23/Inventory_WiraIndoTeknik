# Inventory WiraIndoTeknik

Sistem manajemen inventaris sederhana untuk membantu pencatatan barang masuk, barang keluar, supplier, dan laporan transaksi secara praktis.

## Fitur Utama
- Dashboard ringkasan stok dan statistik
- Form pencatatan barang masuk
- Form pencatatan barang keluar
- Manajemen data supplier
- Tampilan laporan dan riwayat transaksi
- Integrasi dengan backend PHP dan database MySQL

## Teknologi yang Digunakan
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL
- Server lokal: XAMPP / Laragon

## Persyaratan Sistem
- XAMPP, Laragon, atau server lokal serupa
- PHP minimal 8.x
- MySQL / MariaDB
- Browser modern (Chrome, Edge, Firefox)

## Cara Menjalankan Project
1. Letakkan folder project ini di direktori web server Anda, misalnya pada XAMPP di `htdocs`.
2. Jalankan Apache dan MySQL dari XAMPP.
3. Buka phpMyAdmin, buat database baru dengan nama `inventaris_tb`.
4. Import file [database.sql](database.sql) ke database tersebut.
5. Buka browser dan akses:
   - `http://localhost/Inventory_WiraIndoTeknik`

## Konfigurasi Database
File [api.php](api.php) sudah dikonfigurasi untuk terhubung ke database MySQL dengan kredensial default XAMPP:

- Host: `127.0.0.1`
- Database: `inventaris_tb`
- Username: `root`
- Password: kosong

Jika Anda menggunakan konfigurasi MySQL lain, sesuaikan nilai di bagian atas file [api.php](api.php).

## Struktur File
- [index.html](index.html) — tampilan utama aplikasi
- [styles.css](styles.css) — desain dan layout UI
- [app.js](app.js) — logika frontend aplikasi
- [api.php](api.php) — endpoint backend untuk mengakses data dari MySQL
- [database.sql](database.sql) — skema tabel dan data awal
- [database-baru.sql](database-baru.sql) — script SQL baru untuk database inventaris_tb_master
- [database-inventaris.sql](database-inventaris.sql) — script SQL baru untuk database inventaris_tb
- [data.json](data.json) — data pendukung proyek

## Perubahan Terbaru
- Supplier baru otomatis dibuat saat menambahkan barang masuk dengan nama supplier baru.
- Alamat dan telepon supplier sekarang bersifat opsional saat membuat supplier.
- Pengecekan duplikat `kode` ditambahkan untuk `barang_masuk` dan `barang_keluar` di frontend dan backend.
- Input `jumlah` pada barang masuk sekarang mendukung angka negatif.
- Ditambahkan dua file SQL baru untuk impor database yang lebih fleksibel.

## Catatan
- Aplikasi ini dibuat untuk kebutuhan lokal dan belum menggunakan framework backend penuh.
- Pastikan MySQL aktif sebelum membuka aplikasi agar data dapat ditampilkan dan disimpan dengan benar.

## Lisensi
Proyek ini dibuat untuk kebutuhan pembelajaran dan pengembangan aplikasi inventaris sederhana.