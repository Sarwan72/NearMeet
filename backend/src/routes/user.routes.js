import express from "express";
import {
  changePassword,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/user.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.patch("/profile", updateUserProfile);
router.patch("/change-password", changePassword);

// Delete account
router.delete("/delete-account", deleteUserAccount);

export default router;
