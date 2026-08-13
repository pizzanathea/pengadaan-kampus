const mongoose = require("mongoose");

// 1. Skema untuk Pengadaan Barang
const pengadaanSchema = new mongoose.Schema(
  {
    kodePengajuan: { type: String, required: true, unique: true },
    namaBarang: { type: String, required: true, trim: true },
    kategori: { type: String, required: true },
    jumlah: { type: Number, required: true, min: 1 },
    estimasiHarga: { type: Number, required: true },
    keperluan: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Pending", "Disetujui", "Ditolak", "Selesai"], 
        default: "Pending" 
    },
    pemohon: { type: String, required: true },
  },
  { timestamps: true }
);

// 2. Skema untuk Pengajuan
const pengajuanSchema = new mongoose.Schema(
  {
    judulPengajuan: { type: String, required: true, trim: true },
    jenis: { type: String, required: true },
    deskripsi: { type: String, required: true },
    diajukanOleh: { type: String, required: true },
    statusApproval: { 
        type: String, 
        enum: ["Draft", "Menunggu Review", "Disetujui", "Ditolak"], 
        default: "Draft" 
    },
    catatanAdmin: { type: String, default: "" },
  },
  { timestamps: true }
);

// 3. Skema untuk Pengaturan
const pengaturanSchema = new mongoose.Schema(
  {
    namaInstansi: { type: String, required: true, default: "Kampus" },
    tahunAkademik: { type: String, required: true },
    maxBatasPengadaanTanpaApproval: { type: Number, default: 1000000 },
    isMaintenance: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ekspor semua model
const Pengadaan = mongoose.model("Pengadaan", pengadaanSchema);
const Pengajuan = mongoose.model("Pengajuan", pengajuanSchema);
const Pengaturan = mongoose.model("Pengaturan", pengaturanSchema);

module.exports = {
  Pengadaan,
  Pengajuan,
  Pengaturan,
};