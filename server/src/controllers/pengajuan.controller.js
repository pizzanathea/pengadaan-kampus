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
    
    let parsedBarang = [];
    if (daftarBarang) {
      if (typeof daftarBarang === "string") {
        try {
          parsedBarang = JSON.parse(daftarBarang);
        } catch (e) {
          parsedBarang = [];
        }
      } else {
        parsedBarang = daftarBarang;
      }
    }
    
    // Hitung ulang estimasi total biaya jika daftar barang diubah
    const estimasiTotal = parsedBarang.reduce(
      (sum, item) =>
        sum + (Number(item.jumlah) || 0) * (Number(item.harga || item.perkiraanHarga) || 0),
      0,
    );
    
    // Tangkap file baru yang di-upload saat edit (jika ada)
    const newFiles = req.files ? req.files.map(f => f.filename) : [];

    // Ambil data lama di database terlebih dahulu jika ingin menggabungkan lampiran lama dan baru
    const existingData = await Pengajuan.findById(id);
    if (!existingData) {
      return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
    }
    const lampiranLama = req.body.lampiranLama ? (Array.isArray(req.body.lampiranLama) ? req.body.lampiranLama : [req.body.lampiranLama]) : (existingData.lampiran || []);

    const gabunganLampiran = [...lampiranLama, ...newFiles];

    const updateData = {
      alasan,
      daftarBarang: parsedBarang,
      lampiran: gabunganLampiran,
      estimasiTotal,
    };

    const updated = await Pengajuan.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
    }

    res.status(200).json({ success: true, message: "Data berhasil diperbarui", data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

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
      alasan 
    } = req.body;
    
    let parsedBarang = [];
    if (daftarBarang) {
      if (typeof daftarBarang === "string") {
        try {
          parsedBarang = JSON.parse(daftarBarang);
        } catch (e) {
          parsedBarang = [];
        }
      } else {
        parsedBarang = daftarBarang;
      }
    }

    // Pastikan setiap item barang memiliki format angka yang valid
    const formattedBarang = (parsedBarang || []).map((item) => ({
      nama: item.nama,
      kategori: item.kategori || "Elektronik",
      spesifikasi: item.spesifikasi || "",
      jumlah: Number(item.jumlah) || 1,
      satuan: item.satuan || "Unit",
      harga: Number(item.harga || item.perkiraanHarga) || 0,
    }));

    // Hitung total estimasi biaya secara aman
    const estimasiTotal = formattedBarang.reduce((sum, item) => sum + item.jumlah * item.harga, 0);
    const lampiranFiles = req.files ? req.files.map(f => f.filename) : [];

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
      statusApproval: "Menunggu Review",
      lampiran: lampiranFiles, // Menyimpan nama file fisik dari multer
    });

    const savedData = await newPengajuan.save();
    res.status(201).json({ success: true, message: "Pengajuan berhasil dibuat", data: savedData });
  } catch (error) {
    console.error("Error Detail:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
