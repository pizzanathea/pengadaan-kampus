const { Pengajuan } = require("../models/pengadaan.model");

// 1. Daftar pengajuan yang menunggu Persetujuan 1
exports.getAntrianPersetujuan1 = async (req, res) => {
  try {
    const data = await Pengajuan.find({ statusApproval: "menunggu" }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil antrian Persetujuan 1",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Daftar pengajuan yang menunggu Persetujuan 2 (Keuangan)
exports.getAntrianPersetujuan2 = async (req, res) => {
  try {
    const data = await Pengajuan.find({ statusApproval: "menunggu_2" }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil antrian Persetujuan Keuangan",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Setujui di Persetujuan 1 → status jadi "menunggu_2" (diteruskan ke Keuangan)
exports.setujuiTahap1 = async (req, res) => {
  try {
    const { id } = req.params;

    const pengajuan = await Pengajuan.findById(id);
    if (!pengajuan) {
      return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
    }
    if (pengajuan.statusApproval !== "menunggu") {
      return res.status(400).json({
        success: false,
        message: `Pengajuan ini sudah diproses (status saat ini: ${pengajuan.statusApproval})`,
      });
    }

    pengajuan.statusApproval = "menunggu_2";
    const updated = await pengajuan.save();

    res.status(200).json({
      success: true,
      message: "Pengajuan disetujui, diteruskan ke Persetujuan Keuangan",
      data: updated,
    });
  } catch (error) {
    console.error("Error setujuiTahap1:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. Setujui di Persetujuan 2 (Keuangan) → status jadi "disetujui" (FINAL)
exports.setujuiTahap2 = async (req, res) => {
  try {
    const { id } = req.params;

    const pengajuan = await Pengajuan.findById(id);
    if (!pengajuan) {
      return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
    }
    if (pengajuan.statusApproval !== "menunggu_2") {
      return res.status(400).json({
        success: false,
        message: `Pengajuan ini belum lolos Persetujuan 1, atau sudah diproses (status saat ini: ${pengajuan.statusApproval})`,
      });
    }

    pengajuan.statusApproval = "disetujui";
    const updated = await pengajuan.save();

    res.status(200).json({
      success: true,
      message: "Pengajuan disetujui final, siap diproses pengadaan",
      data: updated,
    });
  } catch (error) {
    console.error("Error setujuiTahap2:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Tolak pengajuan — bisa dipanggil dari tahap 1 maupun tahap 2
exports.tolakPengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const { alasanPenolakan } = req.body;

    const pengajuan = await Pengajuan.findById(id);
    if (!pengajuan) {
      return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
    }
    if (!["menunggu", "menunggu_2"].includes(pengajuan.statusApproval)) {
      return res.status(400).json({
        success: false,
        message: `Pengajuan ini sudah final, tidak bisa ditolak lagi (status saat ini: ${pengajuan.statusApproval})`,
      });
    }

    pengajuan.statusApproval = "ditolak";
    if (alasanPenolakan) pengajuan.alasanPenolakan = alasanPenolakan;
    const updated = await pengajuan.save();

    res.status(200).json({ success: true, message: "Pengajuan ditolak", data: updated });
  } catch (error) {
    console.error("Error tolakPengajuan:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
