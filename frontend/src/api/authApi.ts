import { apiInstance } from "./axios";
import toast from "react-hot-toast";

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
  message: string;
}

export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const { data } = await apiInstance.post<AuthResponse>(
      "/auth/register",
      payload,
      { withCredentials: true }
    );
    toast.success(data.message || "Registration successful!");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Registration failed!";
    console.error("Register error:", message);
    throw error;
  }
};

export const loginApi = async (payload: Omit<RegisterPayload, "userName">): Promise<AuthResponse> => {
  try {
    const { data } = await apiInstance.post<AuthResponse>(
      "/auth/login",
      payload,
      { withCredentials: true } 
    );
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Login failed!";
    toast.error(message);
    console.error("Login error:", message);
    throw error;
  }
};
