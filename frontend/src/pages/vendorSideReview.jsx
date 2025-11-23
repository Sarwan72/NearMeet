import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const VendorSideReview = () => {
  const { vendorId } = useParams();         // ← MUST NOT BE undefined
  const [reviews, setReviews] = useState([]);
  const [vendorInfo, setVendorInfo] = useState({});

  useEffect(() => {
    console.log("Vendor ID from URL:", vendorId);  // Debug

    if (!vendorId) return;  // agar undefined ho to API mat call karo
const vendor = JSON.parse(localStorage.getItem("vendor"));
console.log("Vendor Loaded:", vendor);
    async function fetchReviews() {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/review/vendor/${vendorId}`
        );

        setReviews(res.data.reviews || []);

        setVendorInfo({
          hotelName: res.data.hotelName,
          averageRating: res.data.averageRating,
          totalReviews: res.data.totalReviews,
        });

      } catch (err) {
        console.log("Error fetching reviews:", err);
      }
    }

    fetchReviews();
  }, [vendorId]);

  return (
    <div className="max-w-3xl mx-auto p-6">

      <Link to="/vendor-home" className="flex items-center gap-2.5 mb-4">
        <img src="/logo.png" alt="logo" className="h-10 w-10 rounded-xl" />
        <span className="text-xl font-bold">NearMeet Vendor</span>
      </Link>

      <h1 className="text-3xl font-bold mb-2">
        {vendorInfo.hotelName || "Hotel"}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star
            key={num}
            size={20}
            className={
              num <= Math.round(vendorInfo.averageRating || 0)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }
          />
        ))}

        <span className="font-semibold">
          {(vendorInfo.averageRating || 0).toFixed(1)} / 5
        </span>

        <span className="text-gray-500">
          ({vendorInfo.totalReviews || 0} reviews)
        </span>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r._id} className="border p-4 mb-4 rounded-lg bg-white">

            <div className="flex items-center gap-3 mb-3">
              <img
                src={r.userId?.profilePic || "/default-user.png"}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{r.userId?.name}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(r.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={
                    star <= r.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default VendorSideReview;
