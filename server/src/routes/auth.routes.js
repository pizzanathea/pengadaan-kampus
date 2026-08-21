const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  getMe, 
  updateProfile, 
  updatePassword,
  getAllUsers,
  updateUser,
  deleteUser
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Rute Terproteksi untuk Profil Pengguna & Daftar Pengguna
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.get("/users", protect, getAllUsers);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

module.exports = router;