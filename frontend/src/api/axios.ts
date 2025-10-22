import axios, { AxiosError } from "axios";
import type{  AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { store } from "../app/store";
import { logout } from "../features/authSlice";

const API_URL = import.meta.env.VITE_API_URL as string;

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

const handleTokenRefresh = async (originalRequest: InternalAxiosRequestConfig) => {
  try {
    console.log("Attempting token refresh...");

    await apiInstance.post("/auth/refresh-token");

    return apiInstance(originalRequest);
  } catch (error) {
    console.error("Refresh token failed:", error);
    await handleTokenError(error as AxiosError);
    throw error;
  }
};

const handleTokenError = async (error: AxiosError) => {
  console.error("Token error, logging out...", error);
  store.dispatch(logout());
  const message =
    (error.response?.data as { message?: string })?.message ||
    "Session expired. Logging out!";
  toast.error(message);
};

const handleConflictError = (error: AxiosError) => {
  const message =
    (error.response?.data as { message?: string })?.message ||
    "An error occurred!";
  toast.error(message);
};

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      await handleTokenError(error);
      return Promise.reject(error);
    }

    if (error.response?.status === 409 && !originalRequest._retry) {
      originalRequest._retry = true;
      handleConflictError(error);
      return Promise.reject(error);
    }

    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message;
    toast.error(message);
    return Promise.reject(error);
  }
);
