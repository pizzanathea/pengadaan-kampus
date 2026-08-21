const { verifyToken } = require("../config/jwt");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Ambil token dari header "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token
      const decoded = verifyToken(token);

      // Lampirkan data user ke objek request
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Tidak diizinkan, token tidak valid atau sudah kedaluwarsa",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Tidak diizinkan, token tidak ditemukan",
    });
  }
};

module.exports = { protect };