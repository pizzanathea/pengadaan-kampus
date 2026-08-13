const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables dari root server/.env
dotenv.config();

// Inisialisasi koneksi database MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route uji coba
app.get("/", (req, res) => {
  res.json({ message: "API Sistem Pengadaan Kampus Berjalan!" });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});