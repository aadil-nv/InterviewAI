export interface User {
  _id: string;
  email: string;
  userName: string;
}

// In your types file
export interface Interview {
  id: string;
  resumeUrl: string;
  jdUrl: string;
  questions: string[];
  answers: string[];
  score: number | null;
  feedback?: string | null; // Add feedback field
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface InterviewState {
  interviews: Interview[];
  currentInterview: Interview | null;
  loading: boolean;
}


export interface CreateInterviewRequest {
  resumeUrl: string;
  jdUrl: string;
    resumeText: string;
    jdText: string;
    userId: string | undefined;
}

export interface SubmitInterviewResponse {
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