import { Router } from "express";
import {
  createPracticeHandler,
  listPracticeHandler,
} from "./practice.controller";

const router = Router();

router.post("/", createPracticeHandler);
router.get("/", listPracticeHandler);

export default router;
