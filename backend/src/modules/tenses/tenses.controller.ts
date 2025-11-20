import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { listTenses } from "./tenses.service";

export const listTensesHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    res.json(listTenses());
  }
);
