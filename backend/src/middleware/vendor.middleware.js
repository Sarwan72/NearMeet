import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

export const protectRoute = async (req, res, next) => {
  try {
    // console.log("🔍 Cookies received:", req.cookies);
    // console.log("🔍 Authorization header:", req.headers.authorization);

    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log(" No token found in request");
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // console.log("🧩 Token found:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(" Decoded token:", decoded);
if (decoded.role !== "vendor") {
  return res.status(403).json({ message: "Forbidden: not a vendor" });
}
    const vendor = await Vendor.findById(decoded.id).select("-password");
    if (!vendor) {
      console.log(" Vendor not found for ID:", decoded.id);
      return res.status(401).json({ message: "Unauthorized - Vendor not found" });
    }

    req.user = vendor;
    next();
  } catch (error) {
    console.error(" protectRoute error:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
