import express from "express";
import { addVendorReview } from "../controllers/review.controller.js";
import { getVendorReviews } from "../controllers/review.controller.js";
import { getUserDashboardStats } from "../controllers/review.controller.js";
const router = express.Router();


router.post("/vendor/:vendorId", addVendorReview);
router.get("/vendor/:vendorId", getVendorReviews);
router.get("/userdashboard/stats", getUserDashboardStats);

export default router;
