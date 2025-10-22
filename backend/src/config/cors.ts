import cors, { CorsOptions } from "cors";
import { config } from "./env";

const allowedOrigins = config.CORS_ORIGINS
  ? config.CORS_ORIGINS.split(",").map(origin => origin.trim())
  : ["http://localhost:5173"]; // fallback for dev

console.log("Allowed CORS Origins:", allowedOrigins);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);
export default corsMiddleware;
