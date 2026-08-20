const express = require('express');
const router = express.Router();

const {
  getAllPengajuan,
  getLaporan,
  createPengajuan,
  updatePengajuan,
  uploadFiles,
} = require("../controllers/pengajuan.controller");

router.get("/", getAllPengajuan);
router.get("/laporan", getLaporan);
router.post("/", uploadFiles, createPengajuan);
router.put("/:id", uploadFiles, updatePengajuan);

module.exports = router;
