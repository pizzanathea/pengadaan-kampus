const express = require('express');
const router = express.Router();

// Pastikan 'uploadFiles' ikut di-import di sini dari file controller
<<<<<<< HEAD
const {
  getAllPengajuan,
  createPengajuan,
  updatePengajuan,
  uploadFiles
=======
const { 
  getAllPengajuan, 
  getLaporan,
  createPengajuan, 
  updatePengajuan, 
  uploadFiles 
>>>>>>> e5ffc7c (laporan)
} = require('../controllers/pengajuan.controller');

router.get('/', getAllPengajuan);
router.get('/laporan', getLaporan);
router.post('/', uploadFiles, createPengajuan); // Pastikan uploadFiles ada di sini
router.put('/:id', uploadFiles, updatePengajuan);

module.exports = router;
