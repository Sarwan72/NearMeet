
import express from "express";
import  dotenv from "dotenv";
import path from "path";


// console.log("welcome")


import cookieParser from "cookie-parser";
import cors from "cors";
// import path from "path";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import vendorRoutes from "./routes/vendor.route.js";
import bookingRoutes from "./routes/booking.routes.js";
import { connectDB } from "./lib/db.js";
import notificationRoutes from "./routes/notification.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import dashboardRoutes from "./routes/hotelDashboard.js";
import reviewRoutes from "./routes/review.routes.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Create HTTP server (needed for socket.io)
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174","https://near-meet.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store connected users (userId -> socketId) and vendors (vendorId -> socketId)
export const onlineUsers = new Map();
export const onlineVendors = new Map();

// Socket.io event handlers
io.on("connection", (socket) => {
  // console.log("🔥 Socket connected:", socket.id);

  // When frontend registers userId
  socket.on("registerUser", (userId) => {
    try {
      if (userId) {
        const key = userId.toString();
        onlineUsers.set(key, socket.id);
        console.log("🟢 User registered:", key, "->", socket.id);
      }
    } catch (err) {
      console.error("registerUser error:", err);
    }
  });

  // When a vendor connects
  socket.on("registerVendor", (vendorId) => {
    try {
      if (vendorId) {
        const key = vendorId.toString();
        onlineVendors.set(key, socket.id);
        console.log("🟣 Vendor registered:", key, "->", socket.id);
      }
    } catch (err) {
      console.error("registerVendor error:", err);
    }
  });

  // Disconnect handling: remove from both maps if present
  socket.on("disconnect", () => {
    try {
      // Remove any user entries for this socket
      for (const [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log("🔴 User disconnected:", userId);
          break;
        }
      }

      // Remove any vendor entries for this socket
      for (const [vendorId, socketId] of onlineVendors) {
        if (socketId === socket.id) {
          onlineVendors.delete(vendorId);
          console.log("🔴 Vendor disconnected:", vendorId);
          break;
        }
      }
    } catch (err) {
      console.error("disconnect handler error:", err);
    }
  });
});

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://near-meet.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/review", reviewRoutes);



// Start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
