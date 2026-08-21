const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model");
const { generateToken } = require("../config/jwt");
const crypto = require("crypto");

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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan kata sandi wajib diisi",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Email atau kata sandi salah",
      });
    }

    if (!user.aktif) {
      return res.status(403).json({
        success: false,
        message: "Akun Anda tidak aktif",
      });
    }

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,
      data: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        unit: user.unit,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const response = {
      success: true,
      message: "Jika email terdaftar, instruksi reset kata sandi telah dibuat.",
    };
    const user = await User.findOne({ email });

    if (!user) return res.status(200).json(response);

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    if (process.env.NODE_ENV !== "production") response.resetToken = resetToken;
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Token dan kata sandi minimal 8 karakter wajib diisi",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token reset tidak valid atau sudah kedaluwarsa",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(200).json({ success: true, message: "Kata sandi berhasil diubah" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};