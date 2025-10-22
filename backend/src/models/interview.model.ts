import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInterviewDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Added userId
  resumeUrl: string;
  jdUrl: string;
  questions: string[];
  answers: string[];
  score?: number | null;
  feedback?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // reference to User
    resumeUrl: { type: String, required: true },
    jdUrl: { type: String, required: true },
    questions: { type: [String], required: true },
    answers: { type: [String], required: true },
    score: { type: Number, default: null },
    feedback: { type: String, default: null },
  },
  { timestamps: true }
);

export const InterviewModel = mongoose.model<IInterviewDocument>(
  "Interview",
  InterviewSchema
);
