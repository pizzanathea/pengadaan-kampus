const multer = require("multer");
const { Pengajuan } = require("../models/pengadaan.model");

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    // Membersihkan spasi dan karakter aneh pada nama file asli
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});
const upload = multer({ storage });

// Middleware untuk digunakan di route
exports.uploadFiles = upload.array("lampiran", 10);

exports.getAllPengajuan = async (req, res) => {
  try {
    const data = await Pengajuan.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePengajuan = async (req, res) => {
  try {
    const { id } = req.params;

    const { alasan, daftarBarang } = req.body;

    const parsedBarang = daftarBarang ? JSON.parse(daftarBarang) : [];

    // Tangkap file baru yang di-upload saat edit (jika ada)
    const newFiles = req.files ? req.files.map(f => f.filename) : [];

    // Ambil data lama di database terlebih dahulu jika ingin menggabungkan lampiran lama dan baru
    const existingData = await Pengajuan.findById(id);
    const lampiranLama = req.body.lampiranLama ? (Array.isArray(req.body.lampiranLama) ? req.body.lampiranLama : [req.body.lampiranLama]) : (existingData.lampiran || []);

    const gabunganLampiran = [...lampiranLama, ...newFiles];


    const updateData = {
      alasan,
      daftarBarang: parsedBarang,
      lampiran: gabunganLampiran,
    };


    const updated = await Pengajuan.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ success: true, message: "Berhasil diperbarui", data: updated });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createPengajuan = async (req, res) => {
  try {
    // Karena pakai FormData, data harus di-parse jika dikirim sebagai string
    const { nomorPengajuan, tanggalPengajuan, namaPengaju, unitFakultas, prioritas, tanggalDibutuhkan, daftarBarang, alasan } = req.body;

    const parsedBarang = JSON.parse(daftarBarang);
    const lampiranFiles = req.files ? req.files.map(f => f.filename) : [];

    const formattedBarang = parsedBarang.map((item) => ({
      ...item,
      jumlah: Number(item.jumlah) || 1,
      harga: Number(item.harga) || 0,
    }));

    const estimasiTotal = formattedBarang.reduce((sum, item) => sum + item.jumlah * item.harga, 0);

    const newPengajuan = new Pengajuan({
      nomorPengajuan: nomorPengajuan || `PB-${Date.now()}`,
      tanggalPengajuan,
      namaPengaju,
      unitFakultas,
      prioritas,
      tanggalDibutuhkan,

      daftarBarang: formattedBarang,
      alasan,
      estimasiTotal,
      statusApproval: "menunggu",
      lampiran: lampiranFiles, // Menyimpan nama file fisik dari multer
    });

    const savedData = await newPengajuan.save();
    res.status(201).json({ success: true, message: "Pengajuan berhasil dibuat", data: savedData });
  } catch (error) {
    console.error("Error Detail:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
