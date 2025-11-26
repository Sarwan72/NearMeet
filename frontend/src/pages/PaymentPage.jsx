import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { axiosInstance } from "../lib/axios";

const PaymentPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const status = params.get("status");     
  const bookingId = params.get("bookingId");

  const [loading, setLoading] = useState(status === "loading");

  useEffect(() => {
    const completePayment = async () => {
      if (status !== "success" || !bookingId) return;

      try {
        await axiosInstance.post(`api/bookings/${bookingId}/pay`);
        setLoading(false);

        setTimeout(() => navigate("/hotels"), 2000);
      } catch (err) {
        console.error("Payment update failed:", err);
      }
    };

    completePayment();
  }, [status, bookingId, navigate]);

  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
        <p className="text-gray-600 mt-4 text-lg">Redirecting to secure payment...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-green-700 p-6">
        <div className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-md">
          <CheckCircle size={80} className="text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Your booking has been confirmed.</p>
        </div>
      </div>
    );
  }

  if (status === "cancel") {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-red-700 p-6">
        <div className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-md">
          <XCircle size={80} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Payment Cancelled</h1>
          <button
            onClick={() => navigate("/hotels")}
            className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center text-xl text-gray-500">
      Invalid payment link
    </div>
  );
};

export default PaymentPage;
