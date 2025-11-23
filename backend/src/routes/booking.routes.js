import express from "express";
import {
  createBooking,
  acceptBooking,
  rejectBooking,
  getUserBookings,
  getVendorBookings,
  markBookingPaid,
 
} from "../controllers/booking.controller.js"; 

const router = express.Router();

// Create booking
router.post("/book", createBooking);
router.post("/:id/pay", markBookingPaid);

// Vendor actions on bookings
router.post("/requests/:id/accept", acceptBooking);
router.post("/requests/:id/reject", rejectBooking);

// Get bookings
router.get("/user/:userId", getUserBookings);
router.get("/vendor/:vendorId", getVendorBookings);

// Vendor profile management routes

export default router;
