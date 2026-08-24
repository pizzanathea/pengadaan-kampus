const Notification = require("../models/notification.model");

exports.getNotifications = async (req, res) => {
  try {
    const { role, user } = req.query;

    const targetRoles = [role];
    if (role === "Persetujuan 1" || role === "Persetujuan 2") {
      targetRoles.push("Approver");
    }
    if (role === "Admin" || role === "Super Admin") {
      targetRoles.push("Admin Pengadaan");
    }
    if (role === "Super Admin") {
      targetRoles.push("Admin");
    }

    const filter = {
      $or: [
        { role: { $in: targetRoles } },
        { namaPengaju: user },
        { role: "", namaPengaju: "" } // global notification
      ]
    };

    const data = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(
      id,
      { dibaca: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { role, user } = req.query;

    const targetRoles = [role];
    if (role === "Persetujuan 1" || role === "Persetujuan 2") {
      targetRoles.push("Approver");
    }
    if (role === "Admin" || role === "Super Admin") {
      targetRoles.push("Admin Pengadaan");
    }
    if (role === "Super Admin") {
      targetRoles.push("Admin");
    }

    const filter = {
      dibaca: false,
      $or: [
        { role: { $in: targetRoles } },
        { namaPengaju: user },
        { role: "", namaPengaju: "" }
      ]
    };

    await Notification.updateMany(filter, { dibaca: true });
    res.status(200).json({ success: true, message: "Semua notifikasi ditandai sebagai dibaca" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
