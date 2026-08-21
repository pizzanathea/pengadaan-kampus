require("dotenv").config(); // <-- Wajib di paling atas agar .env terbaca
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// 1. Inisialisasi app HARUS DIBUAT PERTAMA KALI sebelum app.use()
const app = express();

// Middleware wajib
app.use(cors());
app.use(express.json());

// Serve folder uploads biar file bisa diakses publik lewat browser.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

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

// Sambungkan ke MongoDB & Jalankan Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Terhubung!");
    app.listen(5000, () => console.log("Server berjalan di port 5000"));
  })
  .catch((err) => console.log(err));