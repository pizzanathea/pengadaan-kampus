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
    prioritas: { type: String, enum: ["Rendah", "Sedang", "Tinggi", "Darurat"], default: "Sedang" },
    tanggalDibutuhkan: { type: String, required: true },
    daftarBarang: [itemBarangSchema], // Array menampung banyak barang sekaligus
    alasan: { type: String, required: true },
    estimasiTotal: { type: Number, required: true },
    statusApproval: { 
      type: String, 
      enum: ["Draft", "Menunggu Review", "Disetujui", "Ditolak", "menunggu", "menunggu_2", "disetujui", "ditolak", "diproses", "selesai", "dibatalkan", "perlu_perbaikan"], 
      default: "menunggu" 
    },
    catatanAdmin: { type: String, default: "" },
    alasanPenolakan: { type: String, default: "" },
    catatanPerbaikan: { type: String, default: "" },
    lampiran: [{ type: String }],
  },
  { timestamps: true },
);

const Pengajuan = mongoose.model("Pengajuan", pengajuanSchema);

module.exports = { Pengajuan };
