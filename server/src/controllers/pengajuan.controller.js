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
    
    // Ambil data lama di database
    const existingData = await Pengajuan.findById(id);
    if (!existingData) {
      return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
    }

    const updateData = {};

    // Update statusApproval jika ada di request body
    if (req.body.statusApproval !== undefined) {
      updateData.statusApproval = req.body.statusApproval;
    }

    for (const field of ["tanggalPengajuan", "namaPengaju", "unitFakultas", "prioritas", "tanggalDibutuhkan"]) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    // Update alasan jika ada di request body
    if (req.body.alasan !== undefined) {
      updateData.alasan = req.body.alasan;
    }

    // Update alasanPenolakan dan catatanAdmin jika ada di request body
    if (req.body.alasanPenolakan !== undefined) {
      updateData.alasanPenolakan = req.body.alasanPenolakan;
      updateData.catatanAdmin = req.body.alasanPenolakan;
    }

    // Update catatanPerbaikan jika ada di request body
    if (req.body.catatanPerbaikan !== undefined) {
      updateData.catatanPerbaikan = req.body.catatanPerbaikan;
    }

    if (req.body.kembaliKe !== undefined) {
      updateData.kembaliKe = req.body.kembaliKe;
    }

    // Update daftarBarang jika ada di request body
    if (req.body.daftarBarang !== undefined) {
      let parsedBarang = [];
      if (typeof req.body.daftarBarang === "string") {
        try {
          parsedBarang = JSON.parse(req.body.daftarBarang);
        } catch (e) {
          parsedBarang = [];
        }
      } else {
        parsedBarang = req.body.daftarBarang;
      }
      updateData.daftarBarang = parsedBarang;

      // Hitung ulang estimasi total biaya jika daftar barang diubah
      updateData.estimasiTotal = parsedBarang.reduce(
        (sum, item) =>
          sum + (Number(item.jumlah) || 0) * (Number(item.harga || item.perkiraanHarga) || 0),
        0,
      );
    }

    // Tangkap file baru yang di-upload saat edit (jika ada)
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(f => f.filename);
      const lampiranLama = req.body.lampiranLama ? (Array.isArray(req.body.lampiranLama) ? req.body.lampiranLama : [req.body.lampiranLama]) : (existingData.lampiran || []);
      updateData.lampiran = [...lampiranLama, ...newFiles];
    } else if (req.body.lampiranLama !== undefined) {
      updateData.lampiran = Array.isArray(req.body.lampiranLama) ? req.body.lampiranLama : [req.body.lampiranLama];
    }

    const updated = await Pengajuan.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
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
