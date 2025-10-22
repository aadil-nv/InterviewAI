import  axios, { AxiosError } from "axios";
import type{ AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { store } from "../app/store";
import { logout } from "../features/authSlice";
console.log("API url is ==>",import.meta.env.VITE_API_URL);

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Base URL
const API_URL = import.meta.env.VITE_API_URL as string;
console.log("API url is ==>",API_URL);


// Create instance
export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // you can use it for cookie if needed
});

// Handle Token Refresh (optional if you have refresh flow)
const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    // Example: call refresh token endpoint if you have one
    await apiInstance.post("/auth/refresh-token");
    return apiInstance(originalRequest);
  } catch (err) {
    await handleTokenError(err as AxiosError);
    throw err;
  }
};

// Logout user on token error
const handleTokenError = async (error: AxiosError) => {
  console.error("Token error, logging out...", error);
  store.dispatch(logout());
  const message = (error.response?.data as { message?: string })?.message || "Session expired. Logging out!";
  toast.error(message);
};

// Handle other custom errors like subscription or conflicts
const handleConflictError = (error: AxiosError) => {
  const message = (error.response?.data as { message?: string })?.message || "An error occurred!";
  toast.error(message);
};

// Response interceptor
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // UNAUTHORIZED -> attempt refresh token once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }

    // FORBIDDEN -> logout
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      await handleTokenError(error);
      return Promise.reject(error);
    }

    // CONFLICT -> show toast
    if (error.response?.status === 409 && !originalRequest._retry) {
      originalRequest._retry = true;
      handleConflictError(error);
      return Promise.reject(error);
    }

    // Other errors
    const message = (error.response?.data as { message?: string })?.message || error.message;
    toast.error(message);
    return Promise.reject(error);
  }
);
