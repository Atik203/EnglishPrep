import { z } from "zod";
import type { ExamType, SkillType } from "./practice.model";

const examEnum: readonly [ExamType, ExamType, ExamType] = [
  "IELTS",
  "TOEFL",
  "GRE",
];
const skillEnum: readonly [SkillType, SkillType, SkillType, SkillType] = [
  "reading",
  "listening",
  "writing",
  "speaking",
];

export const createPracticeSchema = z.object({
  exam: z.enum(examEnum),
  skill: z.enum(skillEnum),
  prompt: z.string().min(1).trim(),
  yourAnswer: z.string().min(1).trim(),
  feedbackOrNotes: z.string().trim().optional(),
});

export const filterPracticeSchema = z.object({
  exam: z.enum(examEnum).optional(),
  skill: z.enum(skillEnum).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CreatePracticeInput = z.infer<typeof createPracticeSchema>;
export type FilterPracticeInput = z.infer<typeof filterPracticeSchema>;
