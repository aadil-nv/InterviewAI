import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import "colors";
import { config } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import rootRoute from "./routes/root.route";
import healthRoute from "./routes/health.route";
import userRoute from "./routes/user.routes";
import authRoute from "./routes/auth.route";
import { HttpStatusCode } from "./constants/http-status-code.enum";
import responseTimeLogger from "./middlewares/responseTime.logger";
import corsMiddleware from "./config/cors";
import interviewRoute from "./routes/interview.route";

export function createApp(): Application {
  const app: Application = express();

  // Security and Middleware
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan(config.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(responseTimeLogger);

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res
        .status(HttpStatusCode.TOO_MANY_REQUESTS)
        .json({ message: "Too many requests" });
    },
  });
  app.use(limiter);

  // Routes
  app.use("/api/", rootRoute);
  app.use("/api/health", healthRoute);
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/interviews", interviewRoute);

  // Error Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
