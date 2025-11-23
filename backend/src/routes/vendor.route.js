import express from "express";
import { signupVendor,loginVendor , logoutVendor, getHotels} from "../controllers/vendor.controller.js";
import { protectRoute } from "../middleware/vendor.middleware.js";
import { updateVendorProfile, changeVendorPassword, deleteVendorAccount, getVendorProfile } from "../controllers/vendor.controller.js";
const router = express.Router();

router.post("/signup", signupVendor);
router.post("/login", loginVendor);
router.post("/logout", logoutVendor);
router.get("/hotels", getHotels);


router.get("/me", protectRoute, getVendorProfile);
router.put("/profile",protectRoute, updateVendorProfile);
router.post("/change-password", protectRoute, changeVendorPassword);
router.post("/delete", protectRoute, deleteVendorAccount);


router.use(protectRoute);

export default router;
