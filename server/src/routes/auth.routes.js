const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  getMe, 
  updateProfile, 
  updatePassword 
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Rute Terproteksi untuk Profil Pengguna
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

module.exports = router;