import { Router } from "express";
import {
  createVocabularyHandler,
  deleteVocabularyHandler,
  listVocabularyHandler,
  updateVocabularyHandler,
} from "./vocab.controller";

const router = Router();

router.post("/", createVocabularyHandler);
router.get("/", listVocabularyHandler);
router.patch("/:id", updateVocabularyHandler);
router.delete("/:id", deleteVocabularyHandler);

export default router;
