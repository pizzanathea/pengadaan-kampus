const express = require("express");
const router = express.Router();
const pengajuanController = require("../controllers/pengajuan.controller");

// Endpoint: GET /api/pengajuan dan POST /api/pengajuan
router.get("/", pengajuanController.getAllPengajuan);
router.post("/", pengajuanController.createPengajuan);
router.put("/:id", pengajuanController.updatePengajuan);

module.exports = router;
