import { CreateInterviewDTO } from "../../dtos/create-interview.dto";
import { Interview } from "../../interfaces/interview.interface";

export interface IInterviewRepository {
  create(data: CreateInterviewDTO, questions: string[], userId: string): Promise<Interview>;
  findAll(): Promise<Interview[]>;
  findById(id: string): Promise<Interview | null>;
  updateAnswersAndScore(id: string,answers: string[],score: number,feedback: string): Promise<Interview | null>;
  deleteById(id: string): Promise<Interview | null>;
  findAllByUserId(userId: string): Promise<Interview[]>;
}
