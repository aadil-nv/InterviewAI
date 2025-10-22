import { Router, RequestHandler } from "express";
import { IInterviewController } from "../controllers/interfaces/interview.controller.interface";
import { container } from "../config/inversify.config";
import { authMiddleware } from "../middlewares/auth.middleware";

const interviewRouter = Router();
const controller = container.get<IInterviewController>("IInterviewController");
    
interviewRouter.post("/create", authMiddleware, controller.createInterview.bind(controller));
interviewRouter.get("/all/:id", authMiddleware, controller.getAllInterviewsByUser.bind(controller));
interviewRouter.get("/:id", authMiddleware, controller.getInterviewById.bind(controller));
interviewRouter.post("/submit/:id", authMiddleware, controller.submitAnswers.bind(controller));
interviewRouter.delete("/:id", authMiddleware, controller.deleteInterview.bind(controller));


export default interviewRouter;

