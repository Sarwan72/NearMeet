import Vendor from "../models/Vendor.js";
import User from "../models/User.js";


export const addVendorReview = async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor)
      return res.status(404).json({ success: false, msg: "Vendor not found" });

    // Push new review
    vendor.reviews.push({
      userId,
      rating,
      comment,
    });

    // Update total reviews
    vendor.totalReviews = vendor.reviews.length;

    // Update average rating
    vendor.averageRating =
      vendor.reviews.reduce((acc, r) => acc + r.rating, 0) /
      vendor.totalReviews;

    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      vendor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};





export const getVendorReviews = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId)
      .populate("reviews.userId", "name profilePic")  // <-- VERY IMPORTANT
      .lean();
    console.log("Vendor from DB:", vendor);

    if (!vendor)
      return res.status(404).json({ success: false, msg: "Vendor not found" });

    return res.json({
      success: true,
      hotelName: vendor.hotelName,
      averageRating: vendor.averageRating || 0,
      totalReviews: vendor.totalReviews || 0,
      reviews: vendor.reviews || [],
    });

  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};



export const getUserDashboardStats = async (req, res) => {
  try {
//     const test = await Vendor.findOne();
// console.log("Vendor test:", test);

    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const cities = await Vendor.distinct("location");
const test = await Vendor.findOne().lean();
console.log("TEST VENDOR FROM DB:", test);
    const trendingUsers = await User.find().limit(10);

    // ⭐ MOST IMPORTANT FIX ⭐
    const featuredHotels = await Vendor.find(
      {},
      "hotelName location photos averageRating totalReviews"
    ).sort({ averageRating: -1 });
 
    res.json({
      totalUsers,
      totalVendors,
      totalCities: cities.length,
      trendingUsers,
      featuredHotels,
      cities,
    });

  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
