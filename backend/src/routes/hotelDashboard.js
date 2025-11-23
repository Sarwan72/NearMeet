import express from "express";
import Vendor from "../models/Vendor.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const users = await User.find({}, "fullName location profilePic").limit(20);

    const vendors = await Vendor.find({}, "hotelName location photos image rating").limit(20);

    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();

    const cities = await Vendor.distinct("location");

    res.json({
      success: true,
      totalUsers,
      totalVendors,
      totalCities: cities.length,
      trendingUsers: users,
      featuredHotels: vendors,
      cities,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
