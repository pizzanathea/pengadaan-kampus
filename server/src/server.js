const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") }); // <-- Wajib di paling atas agar .env terbaca
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// 1. Inisialisasi app HARUS DIBUAT PERTAMA KALI sebelum app.use()
const app = express();

// Middleware wajib
app.use(cors());
app.use(express.json());

// Serve folder uploads biar file bisa diakses publik lewat browser.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Serve static files dari TanStack Start build (.output/public)
app.use(express.static(path.join(__dirname, "..", "..", ".output", "public")));

app.get("/api/pengajuan/lampiran/download/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, "..", "uploads", filename);
  res.download(filePath, filename, (error) => {
    if (error && !res.headersSent) {
      res.status(error.code === "ENOENT" ? 404 : 500).json({
        success: false,
        message: "Lampiran tidak ditemukan.",
      });
    }
  });
});

// --- PASANG RUTE DI SINI (Setelah 'app' dideklarasikan) ---
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes); // <-- Pendaftaran Rute Register / Auth

const pengajuanRoutes = require("./routes/pengajuan.routes");
app.use("/api/pengajuan", pengajuanRoutes);

const pengaturanRoutes = require('./routes/pengaturan.routes');
app.use('/api/unit', pengaturanRoutes);

const notificationRoutes = require("./routes/notification.routes");
app.use("/api/notifications", notificationRoutes);

// Catch-all route: semua rute halaman React dilayani oleh index.html (SPA)
app.get(/.*/, (req, res) => {
  // Jika ini request API atau upload yang tidak terdaftar, kembalikan 404
  if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
    return res.status(404).json({
      success: false,
      message: "Endpoint API tidak ditemukan.",
    });
  }

  // Serve index.html agar React Router bisa menangani routing di sisi klien
  const indexPath = path.join(__dirname, "..", "..", ".output", "public", "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send("Gagal memuat halaman. Pastikan sudah menjalankan 'npm run build'.");
    }
  });
});

// Sambungkan ke MongoDB & Jalankan Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Terhubung!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
  })
  .catch((err) => console.log(err));