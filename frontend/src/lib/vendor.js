// // src/lib/vendor.js
// import axios from "axios";


// axios.defaults.baseURL = "http://localhost:5001";
// // axios.defaults.withCredentials = true;

// // axios.defaults.withCredentials = true;
// export const fetchVendorBookings = async (vendorId) => {
//   const { data } = await axios.get(`/api/bookings/vendor/${vendorId}`);
//   console.log("📦 Vendor bookings API response:", data);
//   return Array.isArray(data) ? data : data.bookings || [];
// };

// export const acceptBooking = async (bookingId) => {
//   const res = await fetch(`/api/bookings/requests/${bookingId}/accept`, {
//     method: "POST",
//   });
//   if (!res.ok) throw new Error("Failed to accept booking");
//   return res.json();
// };

// export const rejectBooking = async (bookingId) => {
//   const res = await fetch(`/api/bookings/requests/${bookingId}/reject`, {
//     method: "POST",
//   });
//   if (!res.ok) throw new Error("Failed to reject booking");
//   return res.json();
// };


// export async function updateVendorProfile(data) {
//   const response = await axios.put("/api/vendors/profile", data, { withCredentials: true });
//   return response.data.vendor;
// }

// // Change password
// export async function changeVendorPassword(currentPassword, newPassword) {
//   const response = await axios.post("/api/vendors/change-password", { currentPassword, newPassword },{ withCredentials: true });
//   return response.data;
// }

// // Delete account
// export async function deleteVendorAccount(password) {
//   const response = await axios.post("/api/vendors/delete", { password }, { withCredentials: true }); // ✅ correct path
//   return response.data;
// }

// export async function logoutVendor() {
//   const response = await axios.post("/api/vendors/logout", {}, { withCredentials: true });
//   return response.data;
// }


// export async function getVendorProfile() {
//   const response = await axios.get("/api/vendors/me",{ withCredentials: true });
//   return response.data.vendor;
// }
// export default axios;

// src/lib/vendor.js

import { axiosInstance } from "./axios";  // <-- USE ONLY THIS INSTANCE

// Fetch vendor bookings
export const fetchVendorBookings = async (vendorId) => {
  const { data } = await axiosInstance.get(`/bookings/vendor/${vendorId}`);
  return Array.isArray(data) ? data : data.bookings || [];
};

// Accept booking
export const acceptBooking = (bookingId) => {
  return axiosInstance.post(`/bookings/requests/${bookingId}/accept`);
};

// Reject booking
export const rejectBooking = (bookingId) => {
  return axiosInstance.post(`/bookings/requests/${bookingId}/reject`);
};

// Update profile
export const updateVendorProfile = async (data) => {
  const res = await axiosInstance.put(`/vendors/profile`, data);
  return res.data.vendor;
};

// Change password
export const changeVendorPassword = async (currentPassword, newPassword) => {
  const res = await axiosInstance.post(`/vendors/change-password`, {
    currentPassword,
    newPassword,
  });
  return res.data;
};

// Delete vendor account
export const deleteVendorAccount = async (password) => {
  const res = await axiosInstance.post(`/vendors/delete`, { password });
  return res.data;
};

// Logout
export const logoutVendor = async () => {
  const res = await axiosInstance.post(`/vendors/logout`);
  return res.data;
};

// Fetch vendor profile
export const getVendorProfile = async () => {
  const res = await axiosInstance.get(`/vendors/me`);
  return res.data.vendor;
};
