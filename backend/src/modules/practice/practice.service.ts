import type { FilterQuery } from "mongoose";
import {
  PracticeEntryModel,
  type PracticeEntryDocument,
} from "./practice.model";
import type {
  CreatePracticeInput,
  FilterPracticeInput,
} from "./practice.schema";

export const createPracticeEntry = async (
  payload: CreatePracticeInput
): Promise<PracticeEntryDocument> => {
  return PracticeEntryModel.create(payload);
};

export const listPracticeEntries = async (
  filters: FilterPracticeInput
): Promise<PracticeEntryDocument[]> => {
  const query: FilterQuery<PracticeEntryDocument> = {};

  if (filters.exam) {
    query.exam = filters.exam;
  }

  if (filters.skill) {
    query.skill = filters.skill;
  }

  const limit = filters.limit ?? 50;

  return PracticeEntryModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};
