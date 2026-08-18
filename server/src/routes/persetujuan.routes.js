const express = require("express");
const router = express.Router();
const persetujuanController = require("../controllers/persetujuan.controller");

// GET /api/persetujuan/tahap-1  → antrian Persetujuan 1
router.get("/tahap-1", persetujuanController.getAntrianPersetujuan1);
router.get("/tahap-2", persetujuanController.getAntrianPersetujuan2);
router.put("/:id/setujui-1", persetujuanController.setujuiTahap1);
router.put("/:id/setujui-2", persetujuanController.setujuiTahap2);
router.put("/:id/tolak", persetujuanController.tolakPengajuan);

module.exports = router;
