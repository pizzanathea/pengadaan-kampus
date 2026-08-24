const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    unit: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["Pengaju", "Persetujuan 1", "Persetujuan 2", "Admin", "Super Admin"], 
      default: "Pengaju" 
    },
    aktif: { type: Boolean, default: true },
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };