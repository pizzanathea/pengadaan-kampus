const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    namaPengaju: { type: String, default: "" }, // targeted user name (if any)
    role: { type: String, default: "" }, // targeted role (if any)
    teks: { type: String, required: true },
    dibaca: { type: Boolean, default: false },
    waktu: { type: String, required: true }, // descriptive relative time or formatted string
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
