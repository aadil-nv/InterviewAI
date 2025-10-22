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