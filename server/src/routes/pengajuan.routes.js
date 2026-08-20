const express = require('express');
const router = express.Router();

// Pastikan 'uploadFiles' ikut di-import di sini dari file controller
const {
  getAllPengajuan,
  createPengajuan,
  updatePengajuan,
  uploadFiles
} = require('../controllers/pengajuan.controller');

router.get('/', getAllPengajuan);
router.post('/', uploadFiles, createPengajuan); // Pastikan uploadFiles ada di sini
router.put('/:id', uploadFiles, updatePengajuan);

module.exports = router;
