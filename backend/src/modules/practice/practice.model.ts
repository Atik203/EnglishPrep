import { Schema, model, type Document } from "mongoose";

export type ExamType = "IELTS" | "TOEFL" | "GRE";
export type SkillType = "reading" | "listening" | "writing" | "speaking";

export interface PracticeEntryDocument extends Document {
  exam: ExamType;
  skill: SkillType;
  prompt: string;
  yourAnswer: string;
  feedbackOrNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const practiceSchema = new Schema<PracticeEntryDocument>(
  {
    exam: {
      type: String,
      enum: ["IELTS", "TOEFL", "GRE"],
      required: true,
    },
    skill: {
      type: String,
      enum: ["reading", "listening", "writing", "speaking"],
      required: true,
    },
    prompt: { type: String, required: true, trim: true },
    yourAnswer: { type: String, required: true, trim: true },
    feedbackOrNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const PracticeEntryModel = model<PracticeEntryDocument>(
  "PracticeEntry",
  practiceSchema
);
