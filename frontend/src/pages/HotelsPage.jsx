

import React, { useState, useEffect } from "react";
import { Star,
  StarHalf,
  StarOff, } from "lucide-react";
import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import { Link } from "react-router";

const SOCKET_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const HotelsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState({});
  const [bookingStatus, setBookingStatus] = useState({});
  const [userBookings, setUserBookings] = useState([]);

  // ⭐ Review States
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedVendorForReview, setSelectedVendorForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}`; not for production 
  // axios.defaults.withCredentials = true; not for production 
  axiosInstance.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}`;
  axiosInstance.defaults.withCredentials = true;

// when user changes, reset all booking-related state
useEffect(() => {
  setBookingStatus({});
  setUserBookings([]);
}, [user?._id]);

  useEffect(() => {
    (async () => {
      try {
        // const res = await axios.get("/api/vendors/hotels");
        // const res = await axios.get("/api/vendors/hotels");
        const res = await axiosInstance.get("/api/vendors/hotels");
        setVendors(res.data || []);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    })();
  }, []);

  // ------------------------------
  // SOCKET SETUP
  // ------------------------------
  useEffect(() => {
    if (!user?._id) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      socket.emit("registerUser", user._id);
    });

    socket.on("bookingNotification", (data) => {
      const vendorId = data.vendorId;
      const key = `${vendorId}_${user._id}`;

      setBookingStatus((prev) => ({
        ...prev,
        [key]: {
          status: data.type,
          bookingId: data.bookingId || prev[key]?.bookingId,
        },
      }));
    });

    return () => socket.disconnect();
  }, [user?._id]);

  // ------------------------------
  // LOAD USER BOOKINGS
  // ------------------------------
  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      try {
        const res = await axiosInstance.get(`/api/bookings/user/${user._id}`);
        const bookings = res.data || [];
        setUserBookings(bookings);

        const map = {};
        bookings.forEach((b) => {
          const vendorId = b.vendor?._id;
          const key = `${vendorId}_${user._id}`;
          map[key] = { status: b.status, bookingId: b._id };
        });

        setBookingStatus(map);
      } catch (err) {
        console.error("User bookings fetch failed:", err);
      }
    })();
  }, [user?._id]);

  // ------------------------------
  // BOOK / PAY HANDLER
  // ------------------------------
  const handleAction = async (vendor) => {
    if (!user?._id) return alert("Please login first!");

    const key = `${vendor._id}_${user._id}`;
    const current = bookingStatus[key];

    if (current?.status === "booked") {
      try {
        const res = await axiosInstance.post("/api/payments/checkout", {
          bookingId: current.bookingId,
          vendorId: vendor._id,
          amount: vendor.price,
        });

        window.location.replace(res.data.url);
      } catch (err) {
        alert("Payment redirect failed");
      }
      return;
    }

    // Book Now
    if (!current) {
      try {
        const res = await axiosInstance.post("/api/bookings/book", {
        // const res = await axios.post("/api/bookings/book", {
          userId: user._id,
          vendorId: vendor._id,
        });

        const bookingId = res.data?.booking?._id;
        setBookingStatus((prev) => ({
          ...prev,
          [key]: { status: "pending", bookingId },
        }));

        alert("Booking request sent!");
      } catch (err) {
        alert("Booking failed");
      }
    }
  };

  // ------------------------------
  // OPEN REVIEW POPUP
  // ------------------------------
  const openReview = (vendor) => {
    setSelectedVendorForReview(vendor);
    setOpenReviewModal(true);
    setReviewRating(0);
    setReviewComment("");
  };

  // ------------------------------
  // SUBMIT REVIEW
  // ------------------------------
  const submitReview = async () => {
    if (!reviewRating) return alert("Please give a rating");

    try {
      await axiosInstance.post(`/api/review/vendor/${selectedVendorForReview._id}`, {
        userId: user._id,
        rating: reviewRating,
        comment: reviewComment,
      });

      alert("Review submitted!");

      const res = await axiosInstance.get("/api/vendors/hotels");
      setVendors(res.data);

      setOpenReviewModal(false);
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  const filteredVendors = vendors.filter((v) =>
    v.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {/* Search Header */}
      <div className="w-full max-w-4xl mb-6">
        <h1 className="text-2xl font-bold mb-3">Available Hotels</h1>
        <input
          type="text"
          placeholder="Search by location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* HOTEL LIST */}
      <div className="flex-1 w-full max-w-4xl flex flex-col gap-6">
        {filteredVendors.map((vendor) => {
          const currentPhoto =
            selectedPhoto[vendor._id] || vendor.photos?.[0] || "";

          const key = `${vendor._id}_${user?._id}`;
          const status = bookingStatus[key]?.status || "none";
          const userReviewed = vendor.reviews?.some(
            (rev) => rev.userId === user._id
          );
          return (
            <div
              key={vendor._id}
              className="bg-white rounded-xl shadow-lg border p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
            >
              {/* LEFT IMAGE */}
              <div className="w-full sm:w-1/2">
                <img
                  src={currentPhoto}
                  className="h-64 w-full object-cover rounded-xl"
                />

                {/* Thumbnails */}
                <div className="flex gap-2 mt-2">
                  {vendor.photos?.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      onClick={() =>
                        setSelectedPhoto({
                          ...selectedPhoto,
                          [vendor._id]: photo,
                        })
                      }
                      className={`w-16 h-16 rounded-lg cursor-pointer border-2 ${
                        currentPhoto === photo
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT DETAILS */}
              <div className="flex flex-col justify-between w-full sm:w-1/2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {vendor.hotelName}
                  </h3>

                  {/* ⭐ STAR RATING */}
                  {/* <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        size={20}
                        className={
                          num <= Math.round(vendor.averageRating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}

                    <span className="font-semibold ml-1">
                      {vendor.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({vendor.totalReviews || 0} reviews)
                    </span>
                    <Link
                      to={`/vendor/${vendor._id}/reviews`}
                      className="text-blue-600 underline text-sm"
                    >
                      View Reviews →
                    </Link>
                  </div> */}
                   <div className="flex items-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                          const rating = vendor.averageRating || 0;
                  
                                          if (rating >= star) {
                                            return (
                                              <Star
                                                key={star}
                                                size={20}
                                                className="text-yellow-500 fill-yellow-500"
                                              />
                                            );
                                          } else if (rating >= star - 0.5) {
                                            return (
                                              <StarHalf
                                                key={star}
                                                size={20}
                                                className="text-yellow-500 fill-yellow-500"
                                              />
                                            );
                                          } else {
                                            return (
                                              <StarOff
                                                key={star}
                                                size={20}
                                                className="text-gray-300"
                                              />
                                            );
                                          }
                                        })}
                  
                                        <span className="font-semibold ml-1">
                                          {(vendor.averageRating || 0).toFixed(1)}
                                        </span>
                  
                                        <span className="text-sm text-gray-500 ml-1">
                                          ({vendor.totalReviews || 0} reviews)
                                        </span>
                                         <Link
                      to={`/vendor/${vendor._id}/reviews`}
                      className="text-blue-600 underline text-sm"
                    >
                      View Reviews →
                    </Link>
                                      </div>

                  {/* LOCATION */}
                  <p className="text-sm text-blue-600">{vendor.location}</p>

                  {/* AMENITIES */}
                  <div className="mt-2 text-gray-600 text-sm">
                    {vendor.amenities?.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-green-500">✔</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm mt-4 text-gray-700">
                    {vendor.description}
                  </p>
                </div>

                {/* PRICE + ACTION */}
                <div className="text-right mt-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹ {vendor.price}
                  </p>
                  <p className="text-sm text-gray-600">Per Night</p>

                  <button
                    onClick={() => handleAction(vendor)}
                    className={`mt-3 px-4 py-2 rounded-lg font-medium ${
                      status === "pending"
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : status === "booked"
                        ? "bg-green-600 text-white"
                        : status === "paid"
                        ? "bg-gray-800 text-white cursor-not-allowed"
                        : status === "rejected"
                        ? "bg-red-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {status === "pending"
                      ? "Pending..."
                      : status === "booked"
                      ? "Confirmed - Pay Now"
                      : status === "paid"
                      ? "Paid ✓"
                      : status === "rejected"
                      ? "Rejected"
                      : "Book Now"}
                  </button>

                  {status === "paid" && !userReviewed && (
                    <button
                      onClick={() => openReview(vendor)}
                      className="btn btn-primary px-10"
                    >
                      Write a Review
                    </button>
                  )}

                  {status === "paid" && userReviewed && (
                    <p className="text-green-600 text-sm mt-2">
                      ✓ You have already reviewed this hotel
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ⭐ REVIEW POPUP MODAL ⭐ */}
      {openReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Review: {selectedVendorForReview?.hotelName}
            </h2>

            {/* Stars */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-8 h-8 cursor-pointer ${
                    reviewRating >= s
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => setReviewRating(s)}
                />
              ))}
            </div>

            {/* Comment */}
            <textarea
              rows="3"
              className="textarea textarea-bordered w-full"
              placeholder="Write your experience..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            ></textarea>

            {/* Buttons */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setOpenReviewModal(false)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>

              <button onClick={submitReview} className="btn btn-sm btn-primary">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsPage;
