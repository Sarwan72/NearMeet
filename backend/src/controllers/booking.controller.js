import BookingRequest from "../models/BookingRequest.js";
import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { io, onlineUsers } from "../server.js";

import Notification from "../models/Notification.js";



export const createBooking = async (req, res) => {
  try {
    const { userId, vendorId } = req.body;

    // 🧩 Step 1: Validate input
    if (!userId || !vendorId) {
      console.log("❌ Missing fields:", { userId, vendorId });
      return res.status(400).json({ message: "User ID and Vendor ID required" });
    }

    // 🏨 Step 2: Check vendor existence
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      console.log("❌ Vendor not found:", vendorId);
      return res.status(404).json({ message: "Vendor not found" });
    }

    // 🔁 Step 3: Check if *this user* already has active booking for *this vendor*
    const existingBooking = await BookingRequest.findOne({
      user: userId,
      vendor: vendorId,
      status: { $in: ["pending", "booked"] }, // prevent same user booking same hotel twice
    });

    if (existingBooking) {
      console.log(" Duplicate booking request by same user for same vendor.");
      return res.status(400).json({
        message: "You already have an active booking for this hotel.",
      });
    }

    // 🆕 Step 4: Create booking
    const booking = await BookingRequest.create({
      user: userId,
      vendor: vendorId,
      status: "pending",
    });

    await booking.populate("user vendor");

    console.log("✅ Booking created:", {
      bookingId: booking._id,
      user: booking.user.fullName,
      vendor: booking.vendor.hotelName,
    });

    // 🧠 Step 5: Real-time notify vendor
    const vendorSocket = onlineUsers.get(vendorId.toString());
    if (vendorSocket) {
      io.to(vendorSocket).emit("bookingNotification", {
        type: "newBooking",
        message: `🆕 New booking request from ${booking.user.fullName}`,
        bookingId: booking._id,
        userId: userId,
      });
      console.log(`📢 Sent real-time booking notification to vendor ${vendorId}`);
    } else {
      console.log("⚠️ Vendor not online:", vendorId);
    }

    // 📨 Step 6: Save notification in DB
    await Notification.create({
      user: userId,
      vendor: vendorId,
      message: `New booking request from ${booking.user.fullName}`,
      type: "newBooking",
    });

    // ✅ Step 7: Response
    res.status(201).json({
      success: true,
      message: "Booking request sent successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};






export const acceptBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    // const booking = await BookingRequest.findById(bookingId).populate("user");
    const booking = await BookingRequest.findById(bookingId)
  .populate("user")
  .populate("vendor");


    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "booked";
    await booking.save();
    // ✅ Real-time notification to user
     const userSocket = onlineUsers.get(booking.user._id.toString());
    if (userSocket) {
      io.to(userSocket).emit("bookingNotification", {
        type: "accepted",
        message: `✅ Your booking at ${booking.vendor.hotelName} was confirmed!`,
        bookingId: booking._id,
      });
    }
    console.log("👀 booking.user:", booking.user);
console.log("👀 booking.vendor:", booking.vendor);
    
await Notification.create({
  user: booking.user._id,
  vendor: booking.vendor._id,
  message:
    booking.status === "booked"
      ? `Your booking at ${booking.vendor.hotelName} was accepted!`
      : `Your booking at ${booking.vendor.hotelName} was rejected.`,
  type: booking.status === "booked" ? "accepted" : "rejected",
});

    // ✅ Find user's socket connection
    const user_Socket = onlineUsers.get(booking.user._id.toString());

    if (user_Socket) {
      io.to(user_Socket).emit("bookingNotification", {
        type: "accepted",
        message: `Your booking at ${booking.vendor.hotelName} was accepted!`,
        bookingId: booking._id,
        vendorId: booking.vendor._id, 
      });
      console.log("📩 Sent real-time notification to user:", booking.user._id);
    }

    res.status(200).json({ message: "Booking accepted successfully", booking });
  } catch (error) {
    console.error("❌ acceptBooking error:", error);
    res.status(500).json({ message: "Failed to accept booking" });
  }
};


export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find and update booking
    const booking = await BookingRequest.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    ).populate("user vendor"); // populate for notification info

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
       booking.status = "rejected";
    await booking.save();
   
await Notification.create({
  user: booking.user._id,
  vendor: booking.vendor._id,
  message:
    booking.status === "booked"
      ? `Your booking at ${booking.vendor.hotelName} was accepted!`
      : `Your booking at ${booking.vendor.hotelName} was rejected.`,
  type: booking.status === "booked" ? "accepted" : "rejected",
});
    // ✅ Real-time notification to user
    const userSocket = onlineUsers.get(booking.user._id.toString());

    if (userSocket) {
      io.to(userSocket).emit("bookingNotification", {
        type: "rejected",
        message: `Your booking at ${booking.vendor.hotelName || "the venue"} was rejected.`,
        bookingId: booking._id,
        vendorId: booking.vendor._id, 
      });
      console.log("📩 Sent rejection notification to user:", booking.user._id);
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error("❌ Reject booking error:", error);
    res.status(500).json({ message: "Error rejecting booking" });
  }
};






export const markBookingPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingRequest.findById(id).populate("vendor user");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "paid";
    await booking.save();
      const vendor_Socket = onlineUsers.get(booking.vendor._id.toString());
    if (vendor_Socket) {
      io.to(vendor_Socket).emit("bookingNotification", {
        type: "paid",
        message: `💰 ${booking.user.fullName} has completed payment.`,
        bookingId: booking._id,
        vendorId: booking.vendor._id, 
      });
    }

    await Notification.create({
      user: booking.user._id,
      vendor: booking.vendor._id,
      message: `${booking.user.fullName} has completed payment.`,
      type: "paid",
    });

    const vendorSocket = onlineUsers.get(booking.vendor._id.toString());
    if (vendorSocket) {
      io.to(vendorSocket).emit("bookingNotification", {
        type: "paid",
        bookingId: booking._id,
        message: `${booking.user.fullName} has paid for the booking.`,
      });
    }

    res.status(200).json({ message: "Payment marked as completed", booking });
  } catch (error) {
    console.error("❌ markBookingPaid error:", error);
    res.status(500).json({ message: "Failed to mark booking as paid" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await BookingRequest.find({ user: userId })
      .populate("vendor", "hotelName location price amenities description photos")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};


export const getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    console.log("📩 getVendorBookings called with vendorId:", vendorId);

    // Validate vendorId
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      console.log("❌ Invalid vendorId:", vendorId);
      return res.status(400).json({ message: "Invalid vendor ID format" });
    }

    // const bookings = await BookingRequest.find({
    //   vendor: new mongoose.Types.ObjectId(vendorId),
    // })
      const bookings = await BookingRequest.find({ vendor: vendorId })
     .select("user status createdAt") 
      .populate("user", "profilePic fullName age knowingLanguages bio location email")
      .sort({ createdAt: -1 })
       .limit(30)
      .lean();

    console.log("✅ Bookings found:", bookings.length);
    res.json(bookings);
  } catch (error) {
    console.error("❌ getVendorBookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};