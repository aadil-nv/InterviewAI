import { apiInstance } from './axios';
import toast from 'react-hot-toast';
import type { CreateInterviewRequest, DeleteInterviewResponse, GetAllInterviewsResponse, SubmitInterviewResponse } from '../interfaces/types';



export const createInterviewAPI = async (data: CreateInterviewRequest) => {
  const res = await apiInstance.post('/interviews/create', data); 
  return res.data; 
};


export const submitInterviewAPI = async (interviewId: string,answers: string[],userId: string | undefined): Promise<SubmitInterviewResponse> => {
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