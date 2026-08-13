require("dotenv").config(); // <-- BARIS INI WAJIB ADA DI PALING ATAS AGAR .env TERBACA
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware wajib
app.use(cors());
app.use(express.json());

// --- PASANG RUTE DI SINI ---
const pengajuanRoutes = require("./routes/pengajuan.routes");
app.use("/api/pengajuan", pengajuanRoutes);

// Sambungkan ke MongoDB & Jalankan Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Terhubung!");
    app.listen(5000, () => console.log("Server berjalan di port 5000"));
  })
  .catch((err) => console.log(err));