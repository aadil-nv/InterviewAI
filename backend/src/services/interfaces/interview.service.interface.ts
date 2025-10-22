import { CreateInterviewDTO } from "../../dtos/create-interview.dto";
import { Interview } from "../../interfaces/interview.interface";
import { IInterviewDocument } from "../../models/interview.model";

export interface IInterviewService {
  createInterview(data: CreateInterviewDTO, resumeText: string, jdText: string , userId: string): Promise<Interview>;
  getAllInterviewsByUser(id: string): Promise<Interview[]>;
  getInterviewById(id: string): Promise<Interview | null>;
  generateQuestions(resumeText: string, jdText: string): Promise<string[]>;
  submitAnswers(id: string, answers: string[] , userId: string): Promise<Interview | null>;
  deleteInterview(id: string): Promise<Interview | null>;
}
