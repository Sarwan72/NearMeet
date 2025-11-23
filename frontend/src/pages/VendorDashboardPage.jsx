import React, { useState, useEffect, useCallback } from "react";
import { X, Check, IndianRupee, Loader2 } from "lucide-react";
import VendorNavbar from "../components/VendorNavbar";
import VendorFooter from "../components/VendorFooter";
import axios from "axios";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

// const SOCKET_URL = "http://localhost:5001";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    booked: "bg-green-100 text-green-700",
    paid: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    unknown: "bg-gray-200 text-gray-700",
  };

  const labels = {
    pending: "⏳ Pending",
    booked: "✅ Confirmed",
    paid: "💰 Paid",
    rejected: "❌ Rejected",
  };

  return (
    <span
      className={`${
        styles[status] || styles.unknown
      } px-3 py-1 rounded-full text-xs font-semibold`}
    >
      {labels[status] || "Unknown"}
    </span>
  );
};

const VendorDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const vendor = JSON.parse(localStorage.getItem("vendor"));
// console.log("Vendor in localStorage:", vendor);
const loadBookings = useCallback(async () => {
  const vendorId = vendor?._id || vendor?.id;
  if (!vendorId) {
    console.error("❌ Vendor ID missing:", vendor);
    return;
  }
  try {
    setLoading(true);
    console.log("📤 Fetching bookings for vendor:", vendorId);
    const { data } = await axios.get(`/api/bookings/vendor/${vendorId}`);
    console.log("📦 Vendor bookings fetched:", data);
    setBookings(data);
  } catch (err) {
    console.error("❌ Error fetching vendor bookings:", err);
    toast.error("Failed to load bookings");
  } finally {
    setLoading(false);
  }
}, [vendor?._id, vendor?.id,]); // ✅ only depend on primitive id

useEffect(() => {
  loadBookings();
}, [loadBookings]);

  // ✅ Setup socket for real-time updates
  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
       transports: ["websocket"] ,
           reconnection: true,        // retry if fails
    reconnectionAttempts: 5,   // up to 5 retries
    reconnectionDelay: 2000,   // wait 2s between retries
      
      });

    if (vendor?._id) {
      socket.emit("registerVendor", vendor._id);
    }

    socket.on("bookingNotification", (data) => {
      console.log("📩 Vendor socket event:", data);
      if (data.type === "newBooking") {
        toast.success("🆕 New booking received!");
        loadBookings();
      } else if (data.type === "paid") {
        toast.success("💰 User has completed payment!");
        loadBookings();
      }
    });

    return () => socket.disconnect();
  }, [vendor?._id, loadBookings]);

  const handleAccept = async (id) => {
    try {
      await axios.post(`/api/bookings/requests/${id}/accept`);
      toast.success("✅ Booking confirmed");
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "booked" } : b))
      );
    } catch (err) {
      console.error("Accept failed:", err);
      toast.error("Failed to accept booking");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/api/bookings/requests/${id}/reject`);
      toast("❌ Booking rejected", { icon: "🚫" });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "rejected" } : b))
      );
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error("Failed to reject booking");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <VendorNavbar />
      <Toaster position="top-right" />

      <main className="flex-grow flex flex-col items-center p-6">
        <div className="w-full max-w-4xl text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
          <p className="text-gray-500">
            Manage user booking requests and track payment status
          </p>
        </div>

        {loading ? (
          <div className="grid gap-3 w-full max-w-4xl">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-28 rounded-lg"
              ></div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No booking requests yet.</p>
        ) : (
          <div className="grid gap-6 w-full max-w-4xl">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition"
              >
                {/* User Avatar */}
                <img
                  src={b.user?.profilePic || "https://placehold.co/100x100"}
                  alt={b.user?.fullName}
                  className="rounded-full w-24 h-24 object-cover border-2 border-blue-500"
                />

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-semibold">{b.user?.fullName}</h2>
                  <p className="text-gray-600 text-sm">
                    Location: {b.user?.location || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Languages:{" "}
                    {Array.isArray(b.user?.knowingLanguages)
                      ? b.user.knowingLanguages.join(", ")
                      : "N/A"}
                  </p>
                  <p className="text-gray-700 text-sm mt-2">{b.user?.bio}</p>

                  <div className="mt-3">
                    <StatusBadge status={b.status} />
                  </div>
                </div>

                {/* Actions */}
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(b._id)}
                      className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center gap-1 hover:bg-green-700"
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button
                      onClick={() => handleReject(b._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-md flex items-center gap-1 hover:bg-red-700"
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}

                {b.status === "booked" && (
                  <p className="text-green-700 font-semibold">
                    ✅ Waiting for payment
                  </p>
                )}
                {b.status === "paid" && (
                  <p className="text-blue-700 font-semibold flex items-center gap-1">
                    <IndianRupee size={16} /> Payment received
                  </p>
                )}
                {b.status === "rejected" && (
                  <p className="text-red-600 font-semibold">
                    ❌ Rejected by you
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <VendorFooter />
    </div>
  );
};

export default VendorDashboardPage;
