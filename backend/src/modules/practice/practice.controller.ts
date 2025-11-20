import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createPracticeSchema, filterPracticeSchema } from "./practice.schema";
import { createPracticeEntry, listPracticeEntries } from "./practice.service";

export const createPracticeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = createPracticeSchema.parse(req.body);
    const entry = await createPracticeEntry(payload);
    res.status(201).json(entry);
  }
);

export const listPracticeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = filterPracticeSchema.parse(req.query);
    const entries = await listPracticeEntries(filters);
    res.json(entries);
  }
);
