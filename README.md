# Pengadaan Kampus

# PROMPT LOVABLE AI — SISTEM PENGADAAN BARANG KAMPUS

Saya ingin membangun sebuah **web application responsive** bernama:

# SISTEM PENGADAAN BARANG KAMPUS

Buat frontend aplikasi ini dengan tampilan **profesional, clean, modern, minimalis, dan enterprise**.

---

# ⚠️ ATURAN PALING PENTING

## SIDEBAR HANYA BOLEH MEMILIKI 6 MENU

Sidebar utama **WAJIB hanya berisi menu berikut:**

1. **Dashboard**

2. **Pengajuan Barang**

3. **Persetujuan**

4. **Proses Pengadaan**

5. **Laporan**

6. **Pengaturan**

**Jangan menambahkan menu Sidebar lainnya.**

Jangan membuat menu:

* Pengguna

* Pengguna & Role

* Vendor

* Purchase Order

* Anggaran

* Data Barang

* Inventory

* Notifikasi

* Master Data

* Menu lainnya

### Catatan:

**Pengguna & Role** harus berada di dalam halaman **Pengaturan**, bukan sebagai menu Sidebar.

**Notifikasi** harus berada sebagai icon/dropdown di **Topbar**, bukan sebagai menu Sidebar.

---

# 1. RESPONSIVE WEB — WAJIB

Aplikasi harus benar-benar **responsive**.

Jangan menggunakan ukuran layar fixed sebagai target utama.

Jangan bergantung pada:

* 1440 × 900

* 1920 × 1080

* Ukuran pixel tertentu

Gunakan layout yang fleksibel dan dapat beradaptasi terhadap ukuran layar.

Aplikasi harus nyaman digunakan pada:

* Desktop

* Laptop

* Tablet

* Smartphone

Harus berjalan dengan baik ketika dibuka melalui browser modern seperti:

* Google Chrome

* Microsoft Edge

* Mozilla Firefox

* Safari

Pastikan tidak terjadi:

* Horizontal overflow yang tidak diperlukan

* Tabel terpotong

* Tombol keluar layar

* Text overflow

* Sidebar menutupi konten

* Form terlalu lebar

* Card berantakan

* Modal keluar dari layar

* Navbar rusak

* Layout bertabrakan

---

# 2. RESPONSIVE BEHAVIOR

## Desktop

Gunakan:

* Sidebar

* Topbar

* Main content

* Table dengan beberapa kolom

* Dashboard multi-column

Sidebar dapat ditampilkan secara permanen.

---

## Tablet

Sidebar dapat:

* Mengecil

* Collapse

* Menjadi drawer

Konten harus menyesuaikan lebar layar.

Grid dashboard harus otomatis menyesuaikan jumlah kolom.

---

## Mobile

Sidebar desktop **tidak boleh memenuhi layar**.

Gunakan:

* Hamburger menu

* Sidebar drawer

* Overlay ketika sidebar dibuka

Topbar harus tetap nyaman digunakan.

Dashboard:

* KPI card menjadi satu atau dua kolom

* Grafik menyesuaikan ukuran layar

* Card menjadi lebih fleksibel

Form:

* Gunakan single column

* Input memenuhi lebar yang tersedia

* Tombol dapat disusun secara vertikal jika diperlukan

Tabel:

Jika tabel terlalu lebar, gunakan pendekatan responsive yang sesuai seperti:

* Horizontal scrolling yang terkontrol

* Transformasi tabel menjadi card/list

* Menyembunyikan kolom yang kurang penting pada mobile

Jangan membuat halaman memiliki horizontal scroll secara keseluruhan hanya karena tabel.

---

# 3. BAHASA UI

**SELURUH UI WAJIB MENGGUNAKAN BAHASA INDONESIA.**

Gunakan Bahasa Indonesia pada:

* Sidebar

* Topbar

* Dashboard

* Form

* Button

* Table

* Status

* Modal

* Notifikasi

* Error message

* Empty state

* Laporan

* Pengaturan

Contoh:

* Dashboard

* Pengajuan Barang

* Persetujuan

* Proses Pengadaan

* Laporan

* Pengaturan

* Buat Pengajuan

* Simpan

* Batal

* Ajukan Pengadaan

* Setujui Pengajuan

* Tolak Pengajuan

* Cari

* Filter

* Edit

* Hapus

Istilah teknis umum seperti:

* API

* ID

* PDF

* Excel

* Email

* Login

boleh tetap digunakan.

---

# 4. DESIGN STYLE

Gunakan gaya:

* Professional

* Clean

* Minimalist

* Modern

* Formal

* Enterprise

* Trustworthy

* Easy to use

Hindari:

* Neon

* Warna terlalu mencolok

* Gradient berlebihan

* Glassmorphism berlebihan

* Animasi berlebihan

* Gaming style

* Desain terlalu colorful

* Card berlebihan

* Shadow terlalu berat

Gunakan whitespace yang cukup.

---

# 5. COLOR PALETTE

Gunakan warna utama:

### Primary

Dark Navy / Deep Blue

### Background

Very Light Gray / Off White

### Surface

White

### Text

Dark Charcoal

### Secondary Text

Slate Gray

### Border

Light Gray

Status:

* Menunggu → muted amber

* Disetujui → muted green

* Ditolak → muted red

* Diproses → muted blue

* Selesai → muted green

* Dibatalkan → muted gray

Gunakan warna status hanya sebagai aksen kecil.

---

# 6. TYPOGRAPHY

Gunakan font:

**Inter**

atau font sans-serif modern yang serupa.

Typography harus:

* Bersih

* Mudah dibaca

* Konsisten

* Responsive

Ukuran font harus menyesuaikan kebutuhan layar secara natural.

Jangan menggunakan font yang terlalu kecil di mobile.

---

# 7. LAYOUT

Gunakan struktur:

```text id="n1afap"

┌──────────────────────────────────────────────┐

│                  TOPBAR                     │

├───────────────┬──────────────────────────────┤

│               │                              │

│   SIDEBAR     │        MAIN CONTENT          │

│               │                              │

│               │                              │

└───────────────┴──────────────────────────────┘

```

Pada mobile:

```text id="v8x9p3"

┌──────────────────────────────┐

│ ☰  Sistem Pengadaan    🔔   │

├──────────────────────────────┤

│                              │

│        MAIN CONTENT          │

│                              │

│                              │

└──────────────────────────────┘

```

Sidebar berubah menjadi drawer pada mobile.

---

# 8. SIDEBAR

Logo:

**Sistem Pengadaan**

Menu:

### UTAMA

* Dashboard

* Pengajuan Barang

* Persetujuan

* Proses Pengadaan

* Laporan

* Pengaturan

**HANYA 6 MENU TERSEBUT.**

Jangan menambahkan menu lain.

Di bagian bawah:

**Budi Santoso**

**Administrator**

dengan avatar.

Pada mobile, sidebar berubah menjadi drawer yang dapat dibuka melalui tombol hamburger.

---

# 9. TOPBAR

Topbar:

Sebelah kiri:

* Hamburger button jika diperlukan

* Breadcrumb

* Judul halaman

Sebelah kanan:

* Search

* Notification

* Profile

Notifikasi:

🔔

Tampilkan badge jumlah notifikasi yang belum dibaca.

---

# 10. LOGIN

Buat halaman Login yang responsive.

Desktop:

Gunakan layout dua kolom.

Mobile:

Ubah menjadi satu kolom.

Bagian branding:

**Sistem Pengadaan Barang**

Deskripsi:

**“Kelola pengajuan dan proses pengadaan barang kampus secara mudah, terstruktur, dan transparan.”**

Form:

* Email

* Kata Sandi

* Ingat saya

* Masuk

* Lupa kata sandi?

Pastikan form nyaman digunakan dengan touch screen.

---

# 11. DASHBOARD

Route:

`/dashboard`

Judul:

**Dashboard**

Subtitle:

**Ringkasan aktivitas pengadaan barang kampus**

KPI:

* Total Pengajuan

* Menunggu Persetujuan

* Disetujui

* Sedang Diproses

* Selesai

Desktop:

Gunakan grid beberapa kolom.

Tablet:

Grid menyesuaikan.

Mobile:

KPI berubah menjadi satu atau dua kolom.

---

### Statistik Pengajuan

Grafik:

**Pengajuan Berdasarkan Status**

Status:

* Menunggu Persetujuan

* Disetujui

* Ditolak

* Diproses

* Selesai

Grafik harus responsive.

---

### Pengajuan Terbaru

Desktop:

Gunakan tabel.

Mobile:

Gunakan responsive table atau card/list.

Data:

* Nomor

* Pengaju

* Unit

* Barang

* Nilai

* Tanggal

* Status

---

# 12. PENGAJUAN BARANG

Route:

`/pengajuan`

Judul:

**Pengajuan Barang**

Subtitle:

**Kelola seluruh pengajuan kebutuhan barang**

Bagian atas:

* Search

* Filter Status

* Filter Unit

* Filter Tanggal

* **+ Buat Pengajuan**

Desktop:

Gunakan tabel.

Mobile:

Tampilkan data sebagai card/list atau tabel horizontal yang terkontrol.

Kolom:

* Nomor Pengajuan

* Tanggal

* Pengaju

* Unit

* Barang

* Jumlah

* Estimasi Biaya

* Status

* Aksi

---

# 13. BUAT PENGAJUAN

Route:

`/pengajuan/buat`

Judul:

**Buat Pengajuan Barang**

Form responsive.

### Informasi Pengajuan

* Nomor Pengajuan

* Tanggal Pengajuan

* Nama Pengaju

* Unit / Fakultas

* Prioritas

* Tanggal Dibutuhkan

Desktop:

Boleh menggunakan dua kolom.

Mobile:

Wajib single column.

---

### Detail Barang

Tabel dynamic:

* Nama Barang

* Kategori

* Spesifikasi

* Jumlah

* Satuan

* Estimasi Harga

* Total

Button:

**+ Tambah Barang**

Pada mobile, jangan biarkan tabel membuat seluruh halaman overflow.

Gunakan responsive table atau ubah item menjadi card/form group.

---

### Alasan Pengajuan

Textarea.

---

### Lampiran

Upload dokumen.

---

### Ringkasan

* Total Barang

* Total Kuantitas

* Estimasi Total

Button:

**Simpan sebagai Draf**

**Ajukan Pengadaan**

Pada mobile tombol dapat menjadi full-width.

---

# 14. DETAIL PENGAJUAN

Route:

`/pengajuan/:id`

Judul:

**Detail Pengajuan**

Contoh:

**PB-2026-00125**

Status:

**Menunggu Persetujuan**

Informasi:

* Pengaju

* Unit

* Tanggal

* Prioritas

* Tanggal Dibutuhkan

* Estimasi Total

---

### Daftar Barang

Tampilkan tabel responsive.

---

### Alasan Pengajuan

Tampilkan alasan.

---

### Lampiran

Tampilkan daftar file.

---

### Riwayat Pengajuan

Timeline:

```text id="b4l5se"

✓ Pengajuan dibuat

  Budi Santoso

  10 Agustus 2026 — 08:30

✓ Pengajuan diajukan

  Budi Santoso

  10 Agustus 2026 — 08:45

● Menunggu persetujuan

  Kepala Unit

○ Proses pengadaan

○ Selesai

```

Timeline harus tetap nyaman dibaca pada mobile.

---

# 15. PERSETUJUAN

Route:

`/persetujuan`

Judul:

**Persetujuan**

Subtitle:

**Pengajuan yang membutuhkan persetujuan Anda**

Filter:

* Status

* Unit

* Prioritas

* Tanggal

Desktop:

Gunakan tabel.

Mobile:

Gunakan card/list atau responsive table.

Kolom:

* Nomor

* Pengaju

* Unit

* Barang

* Nilai

* Prioritas

* Tanggal

* Status

* Aksi

---

# 16. DETAIL PERSETUJUAN

Tampilkan:

* Informasi Pengajuan

* Daftar Barang

* Alasan

* Lampiran

* Timeline

Action:

**Setujui Pengajuan**

**Tolak Pengajuan**

**Minta Perbaikan**

Pada mobile, action button dapat ditampilkan secara vertikal/full-width.

Saat menolak:

Modal:

### Alasan Penolakan

Textarea.

Button:

**Batal**

**Konfirmasi Penolakan**

Modal harus responsive dan tidak keluar dari layar.

---

# 17. PROSES PENGADAAN

Route:

`/pengadaan`

Judul:

**Proses Pengadaan**

Subtitle:

**Kelola pengajuan yang telah disetujui**

Tabel desktop:

* Nomor Pengadaan

* Nomor Pengajuan

* Unit

* Barang

* Nilai

* Status

* Tanggal

* Aksi

Mobile:

Gunakan card/list atau responsive table.

Status:

* Menunggu Diproses

* Sedang Diproses

* Selesai

* Dibatalkan

---

### Detail Proses

Workflow:

**Disetujui → Sedang Diproses → Selesai**

Button:

**Mulai Proses**

**Tandai Selesai**

Jangan membuat proses pengadaan terlalu kompleks.

---

# 18. LAPORAN

Route:

`/laporan`

Judul:

**Laporan Pengadaan**

Filter:

* Periode

* Unit

* Status

* Kategori

KPI:

* Total Pengajuan

* Pengajuan Disetujui

* Pengajuan Ditolak

* Total Nilai Pengadaan

Grafik:

* Pengajuan per Bulan

* Pengajuan Berdasarkan Status

* Pengajuan Berdasarkan Unit

Semua grafik harus responsive.

Tabel desktop:

| Nomor | Tanggal | Unit | Pengaju | Barang | Nilai | Status |

Mobile:

Gunakan responsive table atau card.

Button:

**Ekspor Excel**

**Ekspor PDF**

---

# 19. PENGATURAN

Route:

`/pengaturan`

Gunakan tab atau section responsive.

### Profil Kampus

* Nama Kampus

* Logo

* Alamat

* Email

* Nomor Telepon

### Profil Saya

* Nama

* Email

* Foto Profil

* Ubah Kata Sandi

### Pengguna & Role

**Pengguna & Role bukan menu Sidebar.**

Letakkan seluruh pengelolaan pengguna di halaman Pengaturan.

Tabel:

* Nama

* Email

* Unit

* Role

* Status

* Aksi

Role:

* Pengaju

* Approver

* Admin Pengadaan

* Administrator

Button:

**+ Tambah Pengguna**

---

### Pengaturan Sistem

* Nama Sistem

* Format Nomor Pengajuan

* Format Nomor Pengadaan

---

### Pengaturan Notifikasi

Notifikasi bukan menu Sidebar.

Tampilkan pengaturan notifikasi di halaman Pengaturan.

---

# 20. NOTIFIKASI

Notifikasi tidak memiliki halaman Sidebar.

Letakkan sebagai dropdown pada Topbar.

Contoh:

**Pengajuan PB-2026-00125 membutuhkan persetujuan Anda.**

10 menit lalu

---

**Pengajuan PB-2026-00120 telah disetujui.**

1 jam lalu

---

**Pengadaan PB-2026-00118 sedang diproses.**

2 jam lalu

Button:

**Tandai semua sudah dibaca**

Pastikan dropdown responsive.

Pada mobile, notification panel dapat menggunakan drawer atau modal yang sesuai dengan ukuran layar.

---

# 21. REUSABLE COMPONENTS

Buat komponen reusable:

* Sidebar

* Topbar

* Button

* Input

* Select

* Table

* Badge

* Card

* Modal

* Dropdown

* Pagination

* Timeline

* Notification

* File Upload

* Empty State

* Loading State

* Error State

Semua komponen harus responsive.

---

# 22. RESPONSIVE RULES

Gunakan prinsip:

**Mobile → Tablet → Desktop**

Jangan hanya mengecilkan desain desktop.

Komponen harus benar-benar beradaptasi.

### Grid

Gunakan responsive grid.

### Flex

Gunakan flex-wrap jika diperlukan.

### Table

Jangan membuat seluruh halaman memiliki horizontal overflow.

### Form

Desktop:

* Multi-column jika sesuai

Mobile:

* Single column

### Button

Desktop:

* Inline

Mobile:

* Dapat menjadi full-width

### Sidebar

Desktop:

* Permanen

Mobile:

* Drawer

### Modal

Desktop:

* Centered modal

Mobile:

* Responsive modal/drawer

---

# 23. BROWSER COMPATIBILITY

Pastikan frontend dapat digunakan dengan baik pada browser modern:

* Chrome

* Edge

* Firefox

* Safari

Gunakan CSS dan JavaScript yang kompatibel dengan browser modern.

Jangan menggunakan fitur browser eksperimental tanpa alasan.

---

# 24. ACCESSIBILITY

Perhatikan:

* Kontras warna yang cukup

* Label form yang jelas

* Focus state

* Keyboard navigation

* Button yang mudah ditekan pada mobile

* Ukuran teks yang mudah dibaca

* Alt text untuk gambar

* Semantic HTML jika memungkinkan

---

# 25. DATA DUMMY

Gunakan data dummy realistis.

Unit:

* Fakultas Teknik

* Fakultas Ekonomi

* Fakultas Ilmu Komputer

* BAAK

* BAUK

* Perpustakaan

* Laboratorium

Barang:

* Laptop

* Komputer Desktop

* Monitor

* Printer

* Proyektor

* Switch Jaringan

* Access Point

* Kursi

* Meja

* ATK

Gunakan mata uang Rupiah:

**Rp5.000.000**

---

# 26. CODE QUALITY

Gunakan code yang:

* Bersih

* Modular

* Reusable

* Responsive

* Maintainable

* Mudah dikembangkan

Hindari:

* Duplicate code

* Hardcoded data di banyak tempat

* CSS yang berantakan

* Komponen terlalu besar

* Dependency yang tidak diperlukan

Jika project sudah memiliki struktur atau teknologi tertentu, ikuti struktur tersebut.

Jangan mengganti teknologi utama tanpa alasan.

---

# 27. SCOPE

Fitur utama hanya:

1. Login

2. Dashboard

3. Pengajuan Barang

4. Buat Pengajuan

5. Detail Pengajuan

6. Persetujuan

7. Proses Pengadaan

8. Laporan

9. Pengaturan

Tambahan:

* Pengguna & Role → berada di Pengaturan

* Notifikasi → berada di Topbar

Jangan menambahkan menu Sidebar lainnya.

---

# 28. HASIL AKHIR

Saya ingin frontend yang terasa seperti **sistem pengadaan barang kampus sungguhan**, bukan template dashboard generik.

Karakter desain:

**Professional**

**Clean**

**Minimal**

**Modern**

**Responsive**

**Bahasa Indonesia**

**Mudah digunakan**

**Workflow jelas**

**Tidak terlalu kompleks**

---

# INSTRUKSI TERAKHIR

Bangun frontend berdasarkan spesifikasi di atas.

Gunakan dummy data terlebih dahulu.

Pastikan seluruh halaman terhubung melalui routing.

Pastikan navigasi konsisten di seluruh halaman.

Dan yang paling penting:

## SIDEBAR HANYA BOLEH BERISI:

**Dashboard**

**Pengajuan Barang**

**Persetujuan**

**Proses Pengadaan**

**Laporan**

**Pengaturan**

**JANGAN MENAMBAHKAN MENU SIDEBAR APAPUN SELAIN 6 MENU TERSEBUT.**

Pastikan aplikasi **responsive di desktop, laptop, tablet, dan smartphone**, serta tidak mengalami layout rusak atau horizontal overflow yang tidak diperlukan ketika ukuran layar berubah.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/770bd2c9-3a81-4fc0-9a31-a15b865024d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
