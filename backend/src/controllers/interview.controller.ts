import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IInterviewController } from "./interfaces/interview.controller.interface";
import { IInterviewService } from "../services/interfaces/interview.service.interface";
import { HttpStatusCode } from '../constants/http-status-code.enum';


@injectable()
export class InterviewController implements IInterviewController {
  constructor(
    @inject("IInterviewService") private interviewService: IInterviewService
  ) {}

  async createInterview(req: Request, res: Response): Promise<void> {    
    try {
      const { resumeUrl, jdUrl, resumeText, jdText ,userId} = req.body;      

      if (!resumeUrl || !jdUrl || !resumeText || !jdText) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const interview = await this.interviewService.createInterview(
        { resumeUrl, jdUrl },
        resumeText,
        jdText,
        userId
      );

      res.status(201).json({ message: "Interview created successfully", interview });
    } catch (error: any) {
      console.error("Error creating interview:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  async getAllInterviewsByUser(_req: Request, res: Response): Promise<void> {    
    try {
      const { id } = _req.params;
      if (!id) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "User ID is required" });
        return;
      }
      const interviews = await this.interviewService.getAllInterviewsByUser(id);
      res.status(HttpStatusCode.OK).json({interviews});
    } catch (error: any) {
      console.error("Error fetching interviews:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch interviews" });
    }
  }

  async getInterviewById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const interview = await this.interviewService.getInterviewById(id);

      if (!interview) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Interview not found" });
        return;
      }

      res.status(HttpStatusCode.OK).json(interview);
    } catch (error: any) {
      console.error("Error fetching interview:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch interview" });
    }
  }

  async submitAnswers(req: Request, res: Response): Promise<void> {    
    try {
      const { id } = req.params;
      const { answers, userId } = req.body;;

      if (!answers) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const result = await this.interviewService.submitAnswers(id, answers ,userId);
      
      if (!result) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Interview not found" });
        return;
      }

      res.status(HttpStatusCode.OK).json({ message: "Answers submitted successfully", result });
    } catch (error: any) {
      console.error("Error submitting answers:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to submit answers" });
    }
  }

  async deleteInterview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.interviewService.deleteInterview(id);
      if (!deleted) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Interview not found" });
        return;
      }
      res.status(HttpStatusCode.OK).json({ message: "Interview deleted successfully" });
    }
    catch (error: any) {
      console.error("Error deleting interview:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete interview" });
    }
  }
  }
