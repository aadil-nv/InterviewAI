import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export const apiInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RegisterPayload {
  userName?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    _id: string;
    userName: string;
    email: string;
  };
  message?: string;
}

export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const { data } = await apiInstance.post("/auth/register", payload);
    toast.success(data.message || "Registration successful!");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Registration failed!";
    toast.error(message);
    console.error("Register error:", message);
    throw error;
  }
};

export const loginApi = async (payload: Omit<RegisterPayload, "userName">): Promise<AuthResponse> => {
  try {
    const { data } = await apiInstance.post("/auth/login", payload);
    toast.success(data.message || "Login successful!");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Login failed!";
    toast.error(message);
    console.error("Login error:", message);
    throw error;
  }
};
