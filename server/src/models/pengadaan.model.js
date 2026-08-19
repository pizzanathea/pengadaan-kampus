const mongoose = require("mongoose");

// Skema untuk detail item barang di dalam pengajuan
const itemBarangSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  kategori: { type: String, required: true },
  spesifikasi: { type: String },
  jumlah: { type: Number, required: true, min: 1 },
  satuan: { type: String, required: true },
  harga: { type: Number, required: true, min: 0 },
});

// Skema Utama Pengajuan
const pengajuanSchema = new mongoose.Schema(
  {
    nomorPengajuan: { type: String, required: true, unique: true },
    tanggalPengajuan: { type: String, required: true },
    namaPengaju: { type: String, required: true },
    unitFakultas: { type: String, required: true },
    prioritas: {
      type: String,
      enum: ["Rendah", "Sedang", "Tinggi", "Mendesak", "Darurat", "rendah", "sedang", "tinggi", "darurat"],
      default: "Sedang",
    },
    tanggalDibutuhkan: { type: String, required: true },
    daftarBarang: [itemBarangSchema],
    alasan: { type: String, required: true },
    estimasiTotal: { type: Number, required: true },
    statusApproval: {
      type: String,
      enum: [
        "Draft",
        "Menunggu Review",
        "Disetujui",
        "Ditolak",
        "draft",
        "menunggu",
        "menunggu_2",
        "disetujui",
        "ditolak",
        "diproses",
        "selesai",
        "dibatalkan",
        "perlu_perbaikan",
      ],
      default: "menunggu",
    },
    catatanAdmin: { type: String, default: "" },
    alasanPenolakan: { type: String, default: "" },
    catatanPerbaikan: { type: String, default: "" },
    kembaliKe: { type: String, enum: ["menunggu", "menunggu_2"], default: "menunggu" },
    lampiran: [{ type: String }],
  },
  { timestamps: true }
);

// --- TAMBAHAN SKEMA PENGATURAN UNIT DALAM SATU FILE ---
const pengaturanSchema = new mongoose.Schema(
  {
    unitList: {
      type: [String],
      default: ["Fakultas Teknik", "Fakultas Ekonomi dan Bisnis", "Fakultas Ilmu Komputer", "Rektorat", "LPTIK"],
    },
  },
  { timestamps: true }
);

const Pengajuan = mongoose.model("Pengajuan", pengajuanSchema);
const Pengaturan = mongoose.model("Pengaturan", pengaturanSchema);

// Ekspor keduanya dari satu file ini
module.exports = { Pengajuan, Pengaturan };