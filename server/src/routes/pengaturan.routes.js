const express = require("express");
const router = express.Router();
const { getUnit, tambahUnit, hapusUnit } = require("../controllers/pengaturan.controller");

router.get("/", getUnit);
router.post("/", tambahUnit);
router.delete("/:nama", hapusUnit);

module.exports = router;