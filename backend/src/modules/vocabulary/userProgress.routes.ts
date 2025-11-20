import { Router } from "express";
import {
  deleteProgressHandler,
  getProgressHandler,
  getProgressStatsHandler,
  listProgressHandler,
  updateProgressHandler,
} from "./userProgress.controller";

const router = Router();

// All routes require authentication
router.get("/stats", getProgressStatsHandler);
router.get("/", listProgressHandler);
router.get("/:vocabularyId", getProgressHandler);
router.put("/:vocabularyId", updateProgressHandler);
router.delete("/:vocabularyId", deleteProgressHandler);

export default router;
