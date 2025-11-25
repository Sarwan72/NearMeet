// import axios from "axios";

// const BASE_URL =
//   import.meta.env.MODE === "development" ? `${import.meta.env.VITE_BACKEND_URL}/api` : "/api";

// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true, // send cookies with the request
// });


import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

// Example: VITE_BACKEND_URL = https://nearmeet2.onrender.com

export const axiosInstance = axios.create({
  baseURL: BACKEND
    ? `${BACKEND}/api`   // → https://nearmeet2.onrender.com/api
    : "http://localhost:5001/api",
  withCredentials: true,
});

