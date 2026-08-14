const { Pengajuan } = require("../models/pengadaan.model");

// 1. Mendapatkan semua data pengajuan
exports.getAllPengajuan = async (req, res) => {
  try {
    const data = await Pengajuan.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data pengajuan",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tambahkan ini di src/controllers/pengajuan.controller.js
exports.updatePengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Hitung ulang estimasi total biaya jika daftar barang diubah
    const daftarBarang = req.body.daftarBarang || [];
    const estimasiTotal = daftarBarang.reduce(
      (sum, item) => sum + (Number(item.jumlah) || 0) * (Number(item.harga || item.perkiraanHarga) || 0),
      0
    );

    const updateData = {
      ...req.body,
      estimasiTotal: estimasiTotal > 0 ? estimasiTotal : req.body.estimasiTotal,
    };

    const updated = await Pengajuan.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
    }

    res.status(200).json({ success: true, message: "Data berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("Error Update:", error.message); // <-- Cek pesan ini di terminal server
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. Membuat pengajuan baru (Menangani form dari frontend)
exports.createPengajuan = async (req, res) => {
  try {
    const {
      nomorPengajuan,
      tanggalPengajuan,
      namaPengaju,
      unitFakultas,
      prioritas,
      tanggalDibutuhkan,
      daftarBarang,
      alasan,
    } = req.body;

    // Pastikan setiap item barang memiliki format angka yang valid
    const formattedBarang = (daftarBarang || []).map((item) => ({
      nama: item.nama,
      kategori: item.kategori || "Elektronik",
      spesifikasi: item.spesifikasi || "",
      jumlah: Number(item.jumlah) || 1,
      satuan: item.satuan || "Unit",
      harga: Number(item.harga || item.perkiraanHarga) || 0,
    }));

    // Hitung total estimasi biaya secara aman
    const estimasiTotal = formattedBarang.reduce(
      (sum, item) => sum + item.jumlah * item.harga,
      0
    );

    const newPengajuan = new Pengajuan({
      nomorPengajuan: nomorPengajuan || `PB-${Date.now()}`,
      tanggalPengajuan: tanggalPengajuan || new Date().toISOString().split("T")[0],
      namaPengaju,
      unitFakultas,
      prioritas: prioritas || "Sedang",
      tanggalDibutuhkan,
      daftarBarang: formattedBarang,
      alasan,
      estimasiTotal,
      statusApproval: "menunggu",
    });

    const savedData = await newPengajuan.save();

    res.status(201).json({
      success: true,
      message: "Pengajuan berhasil dibuat",
      data: savedData,
    });
  } catch (error) {
    console.error("Error Detail:", error.message); // <-- Cek pesan ini di terminal
    res.status(400).json({
      success: false,
      message: "Gagal menyimpan pengajuan: " + error.message,
    });
  }
};