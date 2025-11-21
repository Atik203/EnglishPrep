import { Schema, model, models, type Document } from "mongoose";

export type UserLearningStatus = "new" | "learning" | "learned";

export interface UserProgressDocument extends Document {
  userId: Schema.Types.ObjectId;
  vocabularyId: Schema.Types.ObjectId;
  status: UserLearningStatus;
  reviewCount: number;
  lastReviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userProgressSchema = new Schema<UserProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vocabularyId: {
      type: Schema.Types.ObjectId,
      ref: "Vocabulary",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["new", "learning", "learned"],
      default: "new",
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    lastReviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound index to ensure one progress record per user per vocabulary
userProgressSchema.index({ userId: 1, vocabularyId: 1 }, { unique: true });

export const UserProgressModel =
  models.UserProgress ||
  model<UserProgressDocument>("UserProgress", userProgressSchema);
