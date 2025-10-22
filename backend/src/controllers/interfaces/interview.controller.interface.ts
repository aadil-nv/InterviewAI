import { Request, Response } from "express";
import { Auth } from "mongodb";
import { AuthRequest } from "../../interfaces/authRequest.interface";
import { CreateInterviewBody } from "../../interfaces/interview.interface";

export interface IInterviewController {
  createInterview(req: Request, res: Response): Promise<void>;
  getAllInterviewsByUser(req: Request, res: Response): Promise<void>;
  getInterviewById(req: Request, res: Response): Promise<void>;
  submitAnswers(req: Request, res: Response): Promise<void>;
  deleteInterview(req: Request, res: Response): Promise<void>;
}
