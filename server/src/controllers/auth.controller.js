const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model");
const { generateToken } = require("../config/jwt");

// Pastikan menggunakan 'exports.register = ...'
exports.register = async (req, res) => {
  try {
    const { nama, email, password, unit } = req.body;

    if (!nama || !email || !password || !unit) {
      return res.status(400).json({ success: false, message: "Semua kolom wajib diisi" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      nama,
      email,
      password: hashedPassword,
      unit,
      role: "Pengaju",
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      token,
      data: {
        id: savedUser._id,
        nama: savedUser.nama,
        email: savedUser.email,
        unit: savedUser.unit,
        role: savedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};