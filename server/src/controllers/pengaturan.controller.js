const { Pengaturan } = require("../models/pengadaan.model");

// 1. Ambil daftar unit (Jika belum ada di database, buat dokumen default otomatis)
exports.getUnit = async (req, res) => {
  try {
    let pengaturan = await Pengaturan.findOne();
    if (!pengaturan) {
      pengaturan = await Pengaturan.create({});
    }
    res.status(200).json({ success: true, data: pengaturan.unitList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Tambah unit baru ke database
exports.tambahUnit = async (req, res) => {
  try {
    const { nama } = req.body;
    if (!nama) {
      return res.status(400).json({ success: false, message: "Nama unit wajib diisi" });
    }

    let pengaturan = await Pengaturan.findOne();
    if (!pengaturan) {
      pengaturan = new Pengaturan({ unitList: [] });
    }

    const trimmedName = nama.trim();
    if (pengaturan.unitList.includes(trimmedName)) {
      return res.status(400).json({ success: false, message: "Unit sudah terdaftar" });
    }

    pengaturan.unitList.push(trimmedName);
    await pengaturan.save();

    res.status(200).json({ success: true, message: "Unit berhasil ditambahkan", data: pengaturan.unitList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Hapus unit dari database
exports.hapusUnit = async (req, res) => {
  try {
    const unitTarget = decodeURIComponent(req.params.nama);

    let pengaturan = await Pengaturan.findOne();
    if (!pengaturan) {
      return res.status(404).json({ success: false, message: "Data pengaturan tidak ditemukan" });
    }

    pengaturan.unitList = pengaturan.unitList.filter((u) => u !== unitTarget);
    await pengaturan.save();

    res.status(200).json({ success: true, message: "Unit berhasil dihapus", data: pengaturan.unitList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};