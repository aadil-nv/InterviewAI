import { apiInstance } from './axios';
import toast from 'react-hot-toast';
import type { Interview } from '../interfaces/types';

interface CreateInterviewRequest {
  resumeUrl: string;
  jdUrl: string;
    resumeText: string;
    jdText: string;
    userId: string | undefined;
}

interface SubmitInterviewResponse {
  message: string;
  result: any; // You can replace 'any' with your Interview type if available
  score: number | null;
  feedback: string | null;
  answers: string[];
}
export interface GetAllInterviewsResponse {
  interviews: Interview[]; 
  message?: string;
}

export interface DeleteInterviewResponse {
  message: string;
}

export const createInterviewAPI = async (data: CreateInterviewRequest) => {
  const res = await apiInstance.post('/interviews/create', data); // your backend route
  return res.data; // should return the created interview with questions
};


export const submitInterviewAPI = async (
  interviewId: string,
  answers: string[],
  userId: string | undefined
): Promise<SubmitInterviewResponse> => {
  try {
    const { data } = await apiInstance.post<SubmitInterviewResponse>(
      `/interviews/submit/${interviewId}`,
      { answers, userId },
      { withCredentials: true }
    );

    toast.success(data.message || "Interview submitted successfully!");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to submit interview!";
    console.error("Submit interview error:", message);
    toast.error(message);
    throw error;
  }
};

export const getAllInterviewsAPI = async (userId: string ): Promise<GetAllInterviewsResponse> => {
  try {
    const { data } = await apiInstance.get<GetAllInterviewsResponse>(`/interviews/all/${userId}`, {
      withCredentials: true,
    });

    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to fetch interviews!";
    console.error("Get all interviews error:", message);
    toast.error(message);
    throw error;
  }
};


export const deleteInterviewAPI = async (interviewId: string): Promise<DeleteInterviewResponse> => {
  try {
    const { data } = await apiInstance.delete<DeleteInterviewResponse>(`/interviews/${interviewId}`, {
      withCredentials: true,
    });

    toast.success(data.message || "Interview deleted successfully!");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to delete interview!";
    console.error("Delete interview error:", message);
    toast.error(message);
    throw error;
  }
};