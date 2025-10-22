import axios, { AxiosError } from "axios";
import type{  AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { store } from "../app/store";
import { logout } from "../features/authSlice";

const API_URL = import.meta.env.VITE_API_URL as string;
console.log("API URL =>", API_URL);

// Extend axios config for retry tracking
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// ✅ Create a single axios instance for your app
export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ required for sending cookies
});

// ✅ Handle refresh token logic
const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    console.log("Attempting token refresh...");

    // Use the same apiInstance to preserve `withCredentials`
    await apiInstance.post("/auth/refresh-token");

    // Retry original request after refresh success
    return apiInstance(originalRequest);
  } catch (error) {
    console.error("Refresh token failed:", error);
    await handleTokenError(error as AxiosError);
    throw error;
  }
};

// ✅ Centralized token error handling
const handleTokenError = async (error: AxiosError) => {
  console.error("Token error, logging out...", error);
  store.dispatch(logout());
  const message =
    (error.response?.data as { message?: string })?.message ||
    "Session expired. Logging out!";
  toast.error(message);
};

// ✅ Conflict (409) handler
const handleConflictError = (error: AxiosError) => {
  const message =
    (error.response?.data as { message?: string })?.message ||
    "An error occurred!";
  toast.error(message);
};

// ✅ Response interceptor
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // 401 = unauthorized → try refresh token once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }

    // 403 = forbidden → logout
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      await handleTokenError(error);
      return Promise.reject(error);
    }

    // 409 = conflict
    if (error.response?.status === 409 && !originalRequest._retry) {
      originalRequest._retry = true;
      handleConflictError(error);
      return Promise.reject(error);
    }

    // Other errors
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message;
    toast.error(message);
    return Promise.reject(error);
  }
);
