import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import LocationField from "../components/LocationField";

// keep same amenities as backend
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

const VendorSignupPage = () => {
  const [formState, setFormState] = useState({
    hotelName: "",
    ownerEmail: "",
    password: "",
    phone: "",
    gstNo: "",
    businessType: "Restaurant",
    location: "",
    price: "",
    openingTime: "",
    closingTime: "",
    photos: [],
    amenities: [],
    description: "",
  });

  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormState((prev) => ({             
        ...prev,
        amenities: [...prev.amenities, value],
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        amenities: prev.amenities.filter((a) => a !== value),
      }));
    }
  };

  const handlePhotoAdd = () => {
    if (formState.photos.length < 5) {
      setFormState((prev) => ({
        ...prev,
        photos: [...prev.photos, ""],
      }));
    }
  };

  const handlePhotoChange = (index, value) => {
    const updated = [...formState.photos];
    updated[index] = value;
    setFormState({ ...formState, photos: updated });
  };

 

  const handleSignup = async (e) => {
  e.preventDefault();
  setIsPending(true);
  setError(null);

  try {
    const res = await axios.post("/api/vendors/signup", formState);

    // Save the newly created hotel
    const newHotel = res.data.vendor;
    localStorage.setItem("newHotel", JSON.stringify(newHotel));

    setIsPending(false);
    navigate("/vendor-home"); // Redirect to Hotels page
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      (err.response?.status === 409
        ? "Email already registered"
        : "Signup failed");
    setError(msg);
    setIsPending(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
      <div className="w-full max-w-lg bg-gradient-to-br from-purple-800/80 to-purple-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-lg">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Company Logo" className="w-12 h-12 mb-2" />
          <h1 className="text-3xl font-bold text-white">NearMeet</h1>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          Vendor Signup
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="hotelName"
            value={formState.hotelName}
            onChange={handleChange}
            placeholder="Hotel / Business Name"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
            required
          />

          <input
            type="email"
            name="ownerEmail"
            value={formState.ownerEmail}
            onChange={handleChange}
            placeholder="Owner Email"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
            required
          />

          <input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
            required
            minLength={6}
          />

          {/* Location */}
          <LocationField formState={formState} setFormState={setFormState} />

          <input
            type="tel"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
            required
          />

          <input
            type="text"
            name="gstNo"
            value={formState.gstNo}
            onChange={handleChange}
            placeholder="GST Number"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
            required
          />
          <input
            type="text"
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
            required
          />

          <input
            type="number"
            name="price"
            value={formState.price}
            onChange={handleChange}
            placeholder="Average Price (₹)"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
            required
          />

          <select
            name="businessType"
            value={formState.businessType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-gray-800"
            required
          >
            <option>Restaurant</option>
            <option>Hotel</option>
            <option>Café</option>
            <option>Club</option>
          </select>

           

          <div className="flex gap-2">
            <input
              type="text"
              name="openingTime"
              value={formState.openingTime}
              onChange={handleChange}
              placeholder="Opening Time (e.g. 09:00 AM)"
              className="w-1/2 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
              required
            />
            <input
              type="text"
              name="closingTime"
              value={formState.closingTime}
              onChange={handleChange}
              placeholder="Closing Time (e.g. 11:00 PM)"
              className="w-1/2 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
              required
            />
          </div>

          {/* Photos */}
          <div>
            <label className="text-white">Photos (URLs)</label>
            {formState.photos.map((photo, i) => (
              <input
                key={i}
                type="text"
                value={photo}
                onChange={(e) => handlePhotoChange(i, e.target.value)}
                placeholder={`Photo URL ${i + 1}`}
                className="w-full mt-2 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300"
              />
            ))}
            <button
              type="button"
              onClick={handlePhotoAdd}
              className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
            >
              + Add Photo
            </button>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-white">Select Amenities</label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
              {amenitiesList.map((a, i) => (
                <label key={i} className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    value={a}
                    checked={formState.amenities.includes(a)}
                    onChange={handleAmenitiesChange}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:opacity-90 transition"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/vendor-login" className="text-yellow-400 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorSignupPage;
