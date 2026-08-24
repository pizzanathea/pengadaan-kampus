  export type StatusPengajuan =
    | "menunggu"
    | "menunggu_2"
    | "disetujui"
    | "ditolak"
    | "diproses"
    | "selesai"
    | "dibatalkan"
    | "perlu_perbaikan";

  export type Prioritas = "Rendah" | "Sedang" | "Tinggi" | "Mendesak";

  export const LABEL_STATUS: Record<StatusPengajuan, string> = {
  menunggu: "Menunggu Persetujuan",
  menunggu_2: "Menunggu Persetujuan Keuangan",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
  diproses: "Sedang Diproses",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  perlu_perbaikan: "Perlu Perbaikan",
};

  export const UNIT_LIST = [
    "Fakultas Teknik",
    "Fakultas Ekonomi",
    "Fakultas Ilmu Komputer",
    "BAAK",
    "BAUK",
    "Perpustakaan",
    "Laboratorium",
  ];

  export const KATEGORI_LIST = [
    "Elektronik",
    "Perangkat Jaringan",
    "Furnitur",
    "Alat Tulis Kantor",
  ];

  export const SATUAN_LIST = ["Unit", "Buah", "Set", "Paket", "Rim", "Box"];

  export const PRIORITAS_LIST: Prioritas[] = ["Rendah", "Sedang", "Tinggi", "Mendesak"];

  export type ItemBarang = {
    nama: string;
    kategori: string;
    spesifikasi: string;
    jumlah: number;
    satuan: string;
    harga: number;
  };

  export type Pengajuan = {
    id: string;
    nomor: string;
    tanggal: string;
    pengaju: string;
    unit: string;
    prioritas: Prioritas;
    tanggalDibutuhkan: string;
    status: StatusPengajuan;
    kembaliKe?: "menunggu" | "menunggu_2";
    alasan: string;
    alasanPenolakan?: string;
    catatanPerbaikan?: string;
    lampiran: { nama: string; ukuran: string }[];
    barang: ItemBarang[];
  };

  export function totalNilai(p: Pengajuan) {
    return p.barang.reduce((s, b) => s + b.jumlah * b.harga, 0);
  }

  export function totalKuantitas(p: Pengajuan) {
    return p.barang.reduce((s, b) => s + b.jumlah, 0);
  }

  export function ringkasanBarang(p: Pengajuan) {
    const [first] = p.barang;
    if (!first) return "-";
    const sisa = p.barang.length - 1;
    return sisa > 0 ? `${first.nama} +${sisa} lainnya` : first.nama;
  }

  export function formatRupiah(nilai: number) {
    return "Rp" + nilai.toLocaleString("id-ID");
  }

  export function formatTanggal(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const lampiranUmum = [
    { nama: "spesifikasi-teknis.pdf", ukuran: "412 KB" },
    { nama: "penawaran-vendor.xlsx", ukuran: "88 KB" },
  ];

  export const PENGAJUAN: Pengajuan[] = [
    {
      id: "PB-2026-00125",
      nomor: "PB-2026-00125",
      tanggal: "2026-08-10",
      pengaju: "Budi Santoso",
      unit: "Fakultas Ilmu Komputer",
      prioritas: "Tinggi",
      tanggalDibutuhkan: "2026-09-01",
      status: "menunggu",
      alasan:
        "Penambahan perangkat laboratorium komputer untuk mendukung praktikum semester ganjil 2026/2027.",
      lampiran: lampiranUmum,
      barang: [
        {
          nama: "Laptop",
          kategori: "Elektronik",
          spesifikasi: "Core i7, RAM 16GB, SSD 512GB",
          jumlah: 10,
          satuan: "Unit",
          harga: 14500000,
        },
        {
          nama: "Monitor",
          kategori: "Elektronik",
          spesifikasi: '24" IPS Full HD',
          jumlah: 10,
          satuan: "Unit",
          harga: 1850000,
        },
      ],
    },
    {
      id: "PB-2026-00124",
      nomor: "PB-2026-00124",
      tanggal: "2026-08-09",
      pengaju: "Siti Rahmawati",
      unit: "Perpustakaan",
      prioritas: "Sedang",
      tanggalDibutuhkan: "2026-08-28",
      status: "menunggu",
      alasan: "Penggantian meja baca yang sudah rusak di ruang baca lantai dua.",
      lampiran: [{ nama: "foto-kondisi-meja.pdf", ukuran: "1,2 MB" }],
      barang: [
        {
          nama: "Meja",
          kategori: "Furnitur",
          spesifikasi: "Meja baca kayu 120x60 cm",
          jumlah: 15,
          satuan: "Buah",
          harga: 1250000,
        },
        {
          nama: "Kursi",
          kategori: "Furnitur",
          spesifikasi: "Kursi kayu tanpa sandaran tangan",
          jumlah: 30,
          satuan: "Buah",
          harga: 480000,
        },
      ],
    },
    {
      id: "PB-2026-00123",
      nomor: "PB-2026-00123",
      tanggal: "2026-08-08",
      pengaju: "Agus Prasetyo",
      unit: "Fakultas Teknik",
      prioritas: "Mendesak",
      tanggalDibutuhkan: "2026-08-20",
      status: "disetujui",
      alasan: "Proyektor ruang kuliah 3.02 dan 3.03 rusak dan tidak dapat diperbaiki.",
      lampiran: lampiranUmum,
      barang: [
        {
          nama: "Proyektor",
          kategori: "Elektronik",
          spesifikasi: "3800 lumens, WXGA",
          jumlah: 4,
          satuan: "Unit",
          harga: 7200000,
        },
      ],
    },
    {
      id: "PB-2026-00122",
      nomor: "PB-2026-00122",
      tanggal: "2026-08-06",
      pengaju: "Dewi Lestari",
      unit: "BAAK",
      prioritas: "Sedang",
      tanggalDibutuhkan: "2026-08-25",
      status: "ditolak",
      alasan: "Penambahan printer untuk layanan legalisir dokumen mahasiswa.",
      lampiran: [],
      barang: [
        {
          nama: "Printer",
          kategori: "Elektronik",
          spesifikasi: "Laser mono, duplex, jaringan",
          jumlah: 3,
          satuan: "Unit",
          harga: 3400000,
        },
      ],
    },
    {
      id: "PB-2026-00121",
      nomor: "PB-2026-00121",
      tanggal: "2026-08-05",
      pengaju: "Rizky Hidayat",
      unit: "Laboratorium",
      prioritas: "Tinggi",
      tanggalDibutuhkan: "2026-08-30",
      status: "diproses",
      alasan: "Peningkatan kapasitas jaringan laboratorium jaringan komputer.",
      lampiran: lampiranUmum,
      barang: [
        {
          nama: "Switch Jaringan",
          kategori: "Perangkat Jaringan",
          spesifikasi: "24 port gigabit managed",
          jumlah: 5,
          satuan: "Unit",
          harga: 4750000,
        },
        {
          nama: "Access Point",
          kategori: "Perangkat Jaringan",
          spesifikasi: "Wi-Fi 6, dual band, PoE",
          jumlah: 8,
          satuan: "Unit",
          harga: 2150000,
        },
      ],
    },
    {
      id: "PB-2026-00120",
      nomor: "PB-2026-00120",
      tanggal: "2026-08-03",
      pengaju: "Nur Aisyah",
      unit: "Fakultas Ekonomi",
      prioritas: "Rendah",
      tanggalDibutuhkan: "2026-08-22",
      status: "disetujui",
      alasan: "Kebutuhan alat tulis kantor untuk kegiatan administrasi triwulan tiga.",
      lampiran: [],
      barang: [
        {
          nama: "ATK",
          kategori: "Alat Tulis Kantor",
          spesifikasi: "Paket ATK administrasi",
          jumlah: 20,
          satuan: "Paket",
          harga: 385000,
        },
      ],
    },
    {
      id: "PB-2026-00119",
      nomor: "PB-2026-00119",
      tanggal: "2026-07-30",
      pengaju: "Hendra Wijaya",
      unit: "BAUK",
      prioritas: "Sedang",
      tanggalDibutuhkan: "2026-08-15",
      status: "selesai",
      alasan: "Penggantian komputer bagian keuangan yang sudah berusia lebih dari enam tahun.",
      lampiran: lampiranUmum,
      barang: [
        {
          nama: "Komputer Desktop",
          kategori: "Elektronik",
          spesifikasi: "Core i5, RAM 8GB, SSD 256GB",
          jumlah: 6,
          satuan: "Unit",
          harga: 9250000,
        },
      ],
    },
    {
      id: "PB-2026-00118",
      nomor: "PB-2026-00118",
      tanggal: "2026-07-28",
      pengaju: "Maya Kusuma",
      unit: "Fakultas Ilmu Komputer",
      prioritas: "Tinggi",
      tanggalDibutuhkan: "2026-08-18",
      status: "diproses",
      alasan: "Penambahan monitor untuk ruang kerja dosen program studi.",
      lampiran: [],
      barang: [
        {
          nama: "Monitor",
          kategori: "Elektronik",
          spesifikasi: '27" IPS QHD',
          jumlah: 12,
          satuan: "Unit",
          harga: 3150000,
        },
      ],
    },
    {
      id: "PB-2026-00117",
      nomor: "PB-2026-00117",
      tanggal: "2026-07-24",
      pengaju: "Fajar Nugroho",
      unit: "Fakultas Teknik",
      prioritas: "Rendah",
      tanggalDibutuhkan: "2026-08-10",
      status: "dibatalkan",
      alasan: "Pengadaan kursi ruang rapat, dibatalkan karena perubahan prioritas anggaran.",
      lampiran: [],
      barang: [
        {
          nama: "Kursi",
          kategori: "Furnitur",
          spesifikasi: "Kursi rapat busa, kaki besi",
          jumlah: 25,
          satuan: "Buah",
          harga: 620000,
        },
      ],
    },
    {
      id: "PB-2026-00116",
      nomor: "PB-2026-00116",
      tanggal: "2026-07-20",
      pengaju: "Sri Wahyuni",
      unit: "Perpustakaan",
      prioritas: "Sedang",
      tanggalDibutuhkan: "2026-08-05",
      status: "selesai",
      alasan: "Digitalisasi koleksi memerlukan perangkat komputer tambahan.",
      lampiran: lampiranUmum,
      barang: [
        {
          nama: "Komputer Desktop",
          kategori: "Elektronik",
          spesifikasi: "Core i5, RAM 16GB, SSD 512GB",
          jumlah: 4,
          satuan: "Unit",
          harga: 10400000,
        },
      ],
    },
  ];

  export type StatusPengadaan = "menunggu-proses" | "diproses" | "selesai" | "dibatalkan";

  export const LABEL_STATUS_PENGADAAN: Record<StatusPengadaan, string> = {
    "menunggu-proses": "Menunggu Diproses",
    diproses: "Sedang Diproses",
    selesai: "Selesai",
    dibatalkan: "Dibatalkan",
  };

  export type Pengadaan = {
    id: string;
    nomor: string;
    nomorPengajuan: string;
    unit: string;
    status: StatusPengadaan;
    tanggal: string;
  };

  export const PENGADAAN: Pengadaan[] = [
    {
      id: "PGD-2026-0048",
      nomor: "PGD-2026-0048",
      nomorPengajuan: "PB-2026-00123",
      unit: "Fakultas Teknik",
      status: "menunggu-proses",
      tanggal: "2026-08-09",
    },
    {
      id: "PGD-2026-0047",
      nomor: "PGD-2026-0047",
      nomorPengajuan: "PB-2026-00121",
      unit: "Laboratorium",
      status: "diproses",
      tanggal: "2026-08-06",
    },
    {
      id: "PGD-2026-0046",
      nomor: "PGD-2026-0046",
      nomorPengajuan: "PB-2026-00120",
      unit: "Fakultas Ekonomi",
      status: "menunggu-proses",
      tanggal: "2026-08-04",
    },
    {
      id: "PGD-2026-0045",
      nomor: "PGD-2026-0045",
      nomorPengajuan: "PB-2026-00118",
      unit: "Fakultas Ilmu Komputer",
      status: "diproses",
      tanggal: "2026-07-29",
    },
    {
      id: "PGD-2026-0044",
      nomor: "PGD-2026-0044",
      nomorPengajuan: "PB-2026-00119",
      unit: "BAUK",
      status: "selesai",
      tanggal: "2026-07-31",
    },
    {
      id: "PGD-2026-0043",
      nomor: "PGD-2026-0043",
      nomorPengajuan: "PB-2026-00116",
      unit: "Perpustakaan",
      status: "selesai",
      tanggal: "2026-07-21",
    },
    {
      id: "PGD-2026-0042",
      nomor: "PGD-2026-0042",
      nomorPengajuan: "PB-2026-00117",
      unit: "Fakultas Teknik",
      status: "dibatalkan",
      tanggal: "2026-07-25",
    },
  ];

  export function getPengajuan(nomor: string) {
    return PENGAJUAN.find((p) => p.nomor === nomor);
  }

  export const PENGGUNA = [
    {
      nama: "Budi Santoso",
      email: "budi.santoso@kampus.ac.id",
      unit: "Fakultas Ilmu Komputer",
      role: "Administrator",
      aktif: true,
    },
    {
      nama: "Siti Rahmawati",
      email: "siti.rahmawati@kampus.ac.id",
      unit: "Perpustakaan",
      role: "Pengaju",
      aktif: true,
    },
    {
      nama: "Agus Prasetyo",
      email: "agus.prasetyo@kampus.ac.id",
      unit: "Fakultas Teknik",
      role: "Approver",
      aktif: true,
    },
    {
      nama: "Dewi Lestari",
      email: "dewi.lestari@kampus.ac.id",
      unit: "BAAK",
      role: "Pengaju",
      aktif: false,
    },
    {
      nama: "Hendra Wijaya",
      email: "hendra.wijaya@kampus.ac.id",
      unit: "BAUK",
      role: "Admin Pengadaan",
      aktif: true,
    },
  ];

  export const ROLE_LIST = ["Pengaju", "Persetujuan 1", "Persetujuan 2", "Admin"];

  export const NOTIFIKASI = [
    {
      id: 1,
      teks: "Pengajuan PB-2026-00125 membutuhkan persetujuan Anda.",
      waktu: "10 menit lalu",
      dibaca: false,
    },
    {
      id: 2,
      teks: "Pengajuan PB-2026-00120 telah disetujui.",
      waktu: "1 jam lalu",
      dibaca: false,
    },
    {
      id: 3,
      teks: "Pengadaan PB-2026-00118 sedang diproses.",
      waktu: "2 jam lalu",
      dibaca: false,
    },
    {
      id: 4,
      teks: "Pengajuan PB-2026-00122 ditolak oleh Kepala Unit.",
      waktu: "1 hari lalu",
      dibaca: true,
    },
  ];

  export const PENGAJUAN_PER_BULAN = [
    { bulan: "Feb", jumlah: 12 },
    { bulan: "Mar", jumlah: 18 },
    { bulan: "Apr", jumlah: 15 },
    { bulan: "Mei", jumlah: 22 },
    { bulan: "Jun", jumlah: 19 },
    { bulan: "Jul", jumlah: 26 },
    { bulan: "Agu", jumlah: 21 },
  ];
