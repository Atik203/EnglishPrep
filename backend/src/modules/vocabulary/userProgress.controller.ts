import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  deleteUserProgress,
  getUserProgress,
  getUserProgressList,
  getUserProgressStats,
  updateUserProgress,
} from "./userProgress.service";

const updateProgressSchema = z.object({
  status: z.enum(["new", "learning", "learned"]),
});

export const getProgressHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const progress = await getUserProgress(userId, req.params.vocabularyId);
    res.json(progress || { status: "new", reviewCount: 0 });
  }
);

export const updateProgressHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { status } = updateProgressSchema.parse(req.body);
    const progress = await updateUserProgress(
      userId,
      req.params.vocabularyId,
      status
    );
    res.json(progress);
  }
);

export const listProgressHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const status = req.query.status as
      | "new"
      | "learning"
      | "learned"
      | undefined;
    const progressList = await getUserProgressList(userId, status);
    res.json(progressList);
  }
);

export const deleteProgressHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await deleteUserProgress(userId, req.params.vocabularyId);
    res.status(204).send();
  }
);

export const getProgressStatsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)?._id || (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const stats = await getUserProgressStats(userId);
    res.json(stats);
  }
);
