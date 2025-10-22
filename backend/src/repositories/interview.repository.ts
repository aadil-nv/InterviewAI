import { injectable } from "inversify";
import { IInterviewRepository } from "./interfaces/interview.repository.interface";
import { InterviewModel, IInterviewDocument } from "../models/interview.model";
import { CreateInterviewDTO } from "../dtos/create-interview.dto";
import { Interview } from "../interfaces/interview.interface";

@injectable()
export class InterviewRepository implements IInterviewRepository {
  async create(data: CreateInterviewDTO, questions: string[], userId: string): Promise<Interview> {
    const newInterview: IInterviewDocument = await InterviewModel.create({
      userId: userId,
      resumeUrl: data.resumeUrl,
      jdUrl: data.jdUrl,
      questions,
      answers: Array(questions.length).fill(""),
      score: null,
      feedback: null,
    });

    return this.mapToEntity(newInterview);
  }

  async findAll(): Promise<Interview[]> {
    const interviews = await InterviewModel.find();
    return interviews.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Interview | null> {
    const i = await InterviewModel.findById(id);
    return i ? this.mapToEntity(i) : null;
  }

  async updateAnswersAndScore(
    id: string,
    answers: string[],
    score: number,
    feedback: string
  ): Promise<Interview | null> {
    const updated = await InterviewModel.findByIdAndUpdate(
      id,
      { answers, score, feedback },
      { new: true }
    );
    return updated ? this.mapToEntity(updated) : null;
  }

  private mapToEntity(i: IInterviewDocument): Interview {
    return {
      id: i._id.toString(),
      resumeUrl: i.resumeUrl,
      jdUrl: i.jdUrl,
      questions: i.questions,
      answers: i.answers,
      score: i.score,
      feedback: i.feedback,
      createdAt: i.createdAt.toISOString(),
    };
  }

  async deleteById(id: string): Promise<Interview | null> {
    const deleted = await InterviewModel.findByIdAndDelete(id);
    return deleted ? this.mapToEntity(deleted) : null;  
  }

  async findAllByUserId(userId: string): Promise<Interview[]> {
    const interviews = await InterviewModel.find({ userId: userId }).sort({ createdAt: -1 });
    return interviews.map(this.mapToEntity);
  }
}
