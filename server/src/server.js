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

// --- Agar folder 'uploads' bisa diakses publik via browser ---
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// --- PASANG RUTE DI SINI (Setelah 'app' dideklarasikan) ---
const pengajuanRoutes = require("./routes/pengajuan.routes");
app.use("/api/pengajuan", pengajuanRoutes);

const pengaturanRoutes = require('./routes/pengaturan.routes');
app.use('/api/unit', pengaturanRoutes);

// Sambungkan ke MongoDB & Jalankan Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Terhubung!");
    app.listen(5000, () => console.log("Server berjalan di port 5000"));
  })
  .catch((err) => console.log(err));