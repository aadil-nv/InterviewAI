import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IInterviewController } from "./interfaces/interview.controller.interface";
import { IInterviewService } from "../services/interfaces/interview.service.interface";

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
    console.log("calling all interviews ");
    
    try {
      const { id } = _req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const interviews = await this.interviewService.getAllInterviewsByUser(id);
      res.status(200).json({interviews});
    } catch (error: any) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  }

  async getInterviewById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const interview = await this.interviewService.getInterviewById(id);

      if (!interview) {
        res.status(404).json({ message: "Interview not found" });
        return;
      }

      res.status(200).json(interview);
    } catch (error: any) {
      console.error("Error fetching interview:", error);
      res.status(500).json({ message: "Failed to fetch interview" });
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
        res.status(404).json({ message: "Interview not found" });
        return;
      }

      res.status(200).json({ message: "Answers submitted successfully", result });
    } catch (error: any) {
      console.error("Error submitting answers:", error);
      res.status(500).json({ message: "Failed to submit answers" });
    }
  }

  async deleteInterview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // Assuming you have a delete method in your service
      const deleted = await this.interviewService.deleteInterview(id);
      if (!deleted) {
        res.status(404).json({ message: "Interview not found" });
        return;
      }
      res.status(200).json({ message: "Interview deleted successfully" });
    }
    catch (error: any) {
      console.error("Error deleting interview:", error);
      res.status(500).json({ message: "Failed to delete interview" });
    }
  }
  }
