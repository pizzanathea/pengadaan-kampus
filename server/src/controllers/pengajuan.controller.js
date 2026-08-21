const multer = require("multer");
const { Pengajuan } = require("../models/pengadaan.model");
const Notification = require("../models/notification.model");

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

exports.getLaporan = async (req, res) => {
  try {
    const { periode = String(new Date().getFullYear()), unit, status, kategori } = req.query;
    const [tahun, semester] = String(periode).split("-");
    const awalTahun = semester === "s1" ? `${tahun}-01-01` : semester === "s2" ? `${tahun}-07-01` : `${tahun}-01-01`;
    const akhirTahun = semester === "s1" ? `${tahun}-07-01` : `${Number(tahun) + 1}-01-01`;
    const filter = {
      tanggalPengajuan: { $gte: awalTahun, $lt: akhirTahun },
      ...(unit && unit !== "semua" ? { unitFakultas: unit } : {}),
      ...(status && status !== "semua" ? { statusApproval: status } : {}),
    };

    let data = await Pengajuan.find(filter).sort({ tanggalPengajuan: 1, createdAt: 1 });
    if (kategori && kategori !== "semua") {
      data = data.filter((item) => item.daftarBarang.some((barang) => barang.kategori === kategori));
    }

    const perStatus = {};
    const perUnit = {};
    const perBulan = Array.from({ length: semester ? 6 : 12 }, (_, index) => ({
      bulan: new Date(Number(tahun), index, 1).toLocaleDateString("id-ID", { month: "short" }),
      jumlah: 0,
    }));

    let totalNilai = 0;
    for (const pengajuan of data) {
      const statusPengajuan = pengajuan.statusApproval;
      perStatus[statusPengajuan] = (perStatus[statusPengajuan] || 0) + 1;
      perUnit[pengajuan.unitFakultas] = (perUnit[pengajuan.unitFakultas] || 0) + 1;
      const bulanMutlak = Number(pengajuan.tanggalPengajuan.slice(5, 7)) - 1;
      const offsetSemester = semester === "s2" ? 6 : 0;
      const bulan = bulanMutlak - offsetSemester;
      if (bulan >= 0 && bulan < perBulan.length) perBulan[bulan].jumlah += 1;
      totalNilai += (pengajuan.daftarBarang || []).reduce(
        (total, barang) => total + (Number(barang.jumlah) || 0) * (Number(barang.harga) || 0),
        0,
      );
    }

    res.status(200).json({
      success: true,
      data,
      ringkasan: {
        totalPengajuan: data.length,
        pengajuanDisetujui: data.filter((item) => ["disetujui", "diproses", "selesai"].includes(item.statusApproval)).length,
        pengajuanDitolak: data.filter((item) => item.statusApproval === "ditolak").length,
        totalNilai,
      },
      perStatus: Object.entries(perStatus).map(([status, jumlah]) => ({ status, jumlah })),
      perUnit: Object.entries(perUnit).map(([unit, jumlah]) => ({ unit, jumlah })),
      perBulan,
    });
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

    // Buat notifikasi jika status approval berubah
    if (updated && existingData.statusApproval !== updated.statusApproval) {
      const statusLama = existingData.statusApproval;
      const statusBaru = updated.statusApproval;

      if (statusBaru === "menunggu_2") {
        // Diteruskan ke Persetujuan Keuangan (Approver)
        await Notification.create({
          role: "Approver",
          teks: `Pengajuan Keuangan ${updated.nomorPengajuan} membutuhkan persetujuan Anda.`,
          waktu: "Baru saja",
        }).catch(e => console.error(e));

        // Info ke Pengaju
        await Notification.create({
          namaPengaju: updated.namaPengaju,
          teks: `Pengajuan ${updated.nomorPengajuan} disetujui Tahap 1, menunggu Persetujuan Keuangan.`,
          waktu: "Baru saja",
        }).catch(e => console.error(e));
      } else if (statusBaru === "disetujui") {
        // Disetujui final
        await Notification.create({
          namaPengaju: updated.namaPengaju,
          teks: `Pengajuan ${updated.nomorPengajuan} telah disetujui.`,
          waktu: "Baru saja",
        }).catch(e => console.error(e));

        await Notification.create({
          role: "Admin Pengadaan",
          teks: `Pengajuan ${updated.nomorPengajuan} siap diproses pengadaan.`,
          waktu: "Baru saja",
        }).catch(e => console.error(e));
      } else if (statusBaru === "ditolak") {
        // Ditolak
        await Notification.create({
          namaPengaju: updated.namaPengaju,
          teks: `Pengajuan ${updated.nomorPengajuan} ditolak oleh Kepala Unit: ${updated.alasanPenolakan || "-"}`,
          waktu: "Baru saja",
        }).catch(e => console.error(e));
      } else if (statusBaru === "perlu_perbaikan") {
        // Perlu perbaikan
        await Notification.create({
          namaPengaju: updated.namaPengaju,
          teks: `Pengajuan ${updated.nomorPengajuan} memerlukan perbaikan: ${updated.catatanPerbaikan || "-"}`,
          waktu: "Baru saja",
        }).catch(e => console.error(e));
      } else if (statusBaru === "diproses") {
        // Diproses pengadaan
        await Notification.create({
          namaPengaju: updated.namaPengaju,
          teks: `Pengadaan ${updated.nomorPengajuan} sedang diproses.`,
          waktu: "Baru saja",
        }).catch(e => console.error(e));
      } else if (statusBaru === "selesai") {
        // Selesai pengadaan
        await Notification.create({
          namaPengaju: updated.namaPengaju,
          teks: `Pengadaan ${updated.nomorPengajuan} telah selesai.`,
          waktu: "Baru saja",
        }).catch(e => console.error(e));
      }
    }

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

    // Buat notifikasi awal untuk Approver
    await Notification.create({
      role: "Approver",
      teks: `Pengajuan ${savedData.nomorPengajuan} oleh ${savedData.namaPengaju} membutuhkan persetujuan Anda.`,
      waktu: "Baru saja",
    }).catch(e => console.error(e));

    res.status(201).json({ success: true, message: "Pengajuan berhasil dibuat", data: savedData });
  } catch (error) {
    console.error("Error Detail:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
