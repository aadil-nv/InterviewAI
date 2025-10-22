import { Router, RequestHandler } from "express";
import { IInterviewController } from "../controllers/interfaces/interview.controller.interface";
import { container } from "../config/inversify.config";

const interviewRouter = Router();
const controller = container.get<IInterviewController>("IInterviewController");

interviewRouter.post("/create", controller.createInterview.bind(controller));
interviewRouter.get("/all/:id", controller.getAllInterviewsByUser.bind(controller));
interviewRouter.get("/:id", controller.getInterviewById.bind(controller) );
interviewRouter.post("/submit/:id", controller.submitAnswers.bind(controller) );
interviewRouter.delete("/:id", controller.deleteInterview.bind(controller) );


export default interviewRouter;

