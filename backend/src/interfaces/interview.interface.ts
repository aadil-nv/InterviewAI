export interface Interview {
  id: string ;
  resumeUrl: string;
  jdUrl: string;
  questions: string[];
  answers: string[];
  score?: number | null;
  feedback?: string | null;
  createdAt: string;
}


export interface CreateInterviewBody {
  resumeUrl: string;
  jdUrl: string;
  resumeText: string;
  jdText: string;
}