import express from "express";
import Notification from "../models/Notification.js";
const router = express.Router();

// ✅ Get notifications for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user: userId })
      .populate("vendor", "hotelName ownerEmail")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// ✅ Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

export default router;
