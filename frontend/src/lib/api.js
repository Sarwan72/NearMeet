import { axiosInstance } from "./axios"

import axios from "axios";
export const signup  = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data; 
}

export const login  = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data; 
}

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
}



export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
    const res = await axiosInstance.post("/auth/onboarding", userData);
    return res.data;
}

export const updateProfile = async (data) => {
  const response = await axiosInstance.patch("/users/profile", data);
  return response.data;
};

export const deleteAccount = async (password) => {
    const res = await axiosInstance.delete('/users/delete-account', { data: { password } });
    return res.data;
};



// import axios from "axios";

export const fetchNotifications = async (userId) => {
  const { data } = await axios.get(`/api/notifications/${userId}`);
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await axios.put(`/api/notifications/${id}/read`);
  return data;
};


