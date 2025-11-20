import { Router } from "express";
import {
  checkDuplicateHandler,
  createVocabularyHandler,
  deleteVocabularyHandler,
  getVocabularyHandler,
  listVocabularyHandler,
  updateVocabularyHandler,
} from "./vocab.controller";

const router = Router();

router.post("/", createVocabularyHandler);
router.get("/", listVocabularyHandler);
router.get("/check-duplicate", checkDuplicateHandler);
router.get("/:id", getVocabularyHandler);
router.patch("/:id", updateVocabularyHandler);
router.delete("/:id", deleteVocabularyHandler);

export default router;
