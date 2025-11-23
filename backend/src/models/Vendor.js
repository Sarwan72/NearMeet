


import mongoose from "mongoose";

const amenitiesList = [
  "Dance floor",
  "Live Music Nights",
  "DJ & Karaoke Evenings",
  "Book with ₹0 Payment",
  "Enjoy Happy Hours with 2+1 offer",
  "Outdoor Garden Seating",
  "Rooftop Dining Experience",
  "Pet-Friendly Area",
  "Kids’ Play Zone",
  "Free Wi-Fi",
  "Valet Parking Available",
  "Private Dining Cabins",
  "Wheelchair Accessible",
  "Sports Screening on Big Screen",
  "Buffet & Unlimited Meal Options",
  "Vegan and Gluten-Free Menu",
  "Takeaway & Home Delivery",
  "Event Hosting & Party Bookings",
  "Family-Friendly Environment",
  "Air Conditioned Halls",
];


const vendorSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // exclude from queries by default
    },
    phone: {
      type: String,
      required: true,
    },
    gstNo: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      enum: ["Restaurant", "Hotel", "Café", "Club"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
    photos: {
      type: [String], // array of image URLs
      default: [],
    },
    amenities: {
      type: [String], // multiple choice selection
      enum: amenitiesList, 
    },
   description: {
    type: String,
    
      
    },
    reviews: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }
],
averageRating: {
  type: Number,
  default: 0,
},
totalReviews: {
  type: Number,
  default: 0,
},

  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
