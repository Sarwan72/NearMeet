import mongoose from "mongoose";

const bookingRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
       index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
       index: true,
    },
    // Removed 'hotel' because vendor itself is the hotel now
    status: {
      type: String,
      enum: ["pending", "booked", "rejected","paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingRequestSchema.index({ vendor: 1, status: 1 });

export default mongoose.model("BookingRequest", bookingRequestSchema);
