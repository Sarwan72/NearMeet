import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Vendor Signup Controller
export const signupVendor = async (req, res) => {
  try {
    // Corrected destructuring to match the vendorSchema
    const {
      hotelName, // Changed from ownerName to match schema
      ownerEmail,
      password,
      location,
      phone,
      gstNo, // Changed from gstNumber to match schema
      businessType,
      price, // Added price as it's a required field
      openingTime,
      closingTime,
      amenities,
      photos,
      description,
      // Added photos as an optional field
    } = req.body;

    // 1. Check if vendor already exists
    const existingVendor = await Vendor.findOne({ ownerEmail });
    if (existingVendor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create vendor
    const newVendor = await Vendor.create({
      hotelName, // Corrected field name
      ownerEmail,
      password: hashedPassword,
      location,
      phone,
      gstNo, // Corrected field name
      businessType,
      price, // Added price
      openingTime,
      closingTime,
      amenities,
      photos,
      description,
    });

    // 4. Generate JWT
    const token = jwt.sign(
      { id: newVendor._id, email: newVendor.ownerEmail, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // for localhost
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "Vendor registered successfully",
      vendor: {
        id: newVendor._id,
        hotelName: newVendor.hotelName,
        ownerEmail: newVendor.ownerEmail,
        businessType: newVendor.businessType,
        gstNo: newVendor.gstNo,
        amenities: newVendor.amenities,
        location: newVendor.location,
        price: newVendor.price,
        description: newVendor.description,
        openingTime: newVendor.openingTime,
        closingTime: newVendor.closingTime,
        photos: newVendor.photos,
        rating: 0,
        ratingText: "New",
        numRatings: 0,
        taxesFees: 0,
      },
      token,
    });
  } catch (error) {
    console.error("Vendor signup error:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// Vendor Login
export const loginVendor = async (req, res) => {
  try {
    const { ownerEmail, password } = req.body;
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false, // for localhost
      sameSite: "lax",
    });

    // Find vendor and explicitly select the password
    const vendor = await Vendor.findOne({ ownerEmail }).select("+password");

    // Check if vendor exists or if password field is missing from the result
    if (!vendor || !vendor.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the provided password matches the hashed password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
   const token = jwt.sign(
  {
    id: vendor._id,
    role: "vendor", 
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);




    // Set HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // for localhost
      // secure: true, // for localhost
       maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Vendor logged in successfully",
      vendor: {
        id: vendor._id,
        hotelName: vendor.hotelName, // Corrected field name
        ownerEmail: vendor.ownerEmail,
        location: vendor.location,
        phone: vendor.phone,
        gstNo: vendor.gstNo,
        businessType: vendor.businessType,
        price: vendor.price,
        openingTime: vendor.openingTime,
        closingTime: vendor.closingTime,
        amenities: vendor.amenities,
        photos: vendor.photos,
        description: vendor.description,
      },
    });
  } catch (error) {
    console.error("Vendor login error:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

export const logoutVendor = async (req, res) => {
  try {
    // Clear the auth cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
    });

    res.status(200).json({ message: "Vendor logged out successfully" });
  } catch (error) {
    console.error("Vendor logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

export const getHotels = async (req, res) => {
  try {
    const hotels = await Vendor.find().select(
      "hotelName location price photos description amenities averageRating totalReviews reviews openingTime closingTime businessType"
    );
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 🛠 Update Vendor Profile
 * Endpoint: PUT /api/vendor/profile
 */
export const updateVendorProfile = async (req, res) => {
  try {
   const vendorId = req.user._id;
    const updatableFields = [
      "hotelName",
      "phone",
      "gstNo",
      "businessType",
      "location",
      "price",
      "openingTime",
      "closingTime",
      "photos",
      "amenities",
      "description",
    ];

    const updateData = {};
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Vendor profile updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Update vendor error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * 🔑 Change Vendor Password
 * Endpoint: POST /api/vendor/change-password
 */
export const changeVendorPassword = async (req, res) => {
  try {
    const vendorId = req.vendor?.id;
    const { currentPassword, newPassword } = req.body;

    const vendor = await Vendor.findById(vendorId).select("+password");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    vendor.password = await bcrypt.hash(newPassword, 10);
    await vendor.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change vendor password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * 🗑 Delete Vendor Account
 * Endpoint: POST /api/vendor/delete
 */
export const deleteVendorAccount = async (req, res) => {
  try {
    // const vendorId =req.vendor?.id || req.body.vendorId;
    const vendorId = req.user?._id;
    const { password } = req.body;

    const vendor = await Vendor.findById(vendorId).select("+password");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    await Vendor.findByIdAndDelete(vendorId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete vendor error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};











export const getVendorProfile = async (req, res) => {
  try {
    // "req.user" is set by protectRoute middleware after verifying JWT
    // const vendor = req.user;
      const vendor = await Vendor.findById(req.user._id).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error("Error in getVendorProfile:", error);
    res.status(500).json({ message: "Failed to fetch vendor profile" });
  }
};







