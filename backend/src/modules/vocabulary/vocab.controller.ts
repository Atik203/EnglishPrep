import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createVocabularySchema,
  filterVocabularySchema,
  updateVocabularySchema,
} from "./vocab.schema";
import {
  createVocabulary,
  deleteVocabulary,
  listVocabulary,
  updateVocabulary,
} from "./vocab.service";

export const createVocabularyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = createVocabularySchema.parse(req.body);
    const vocab = await createVocabulary(payload);
    res.status(201).json(vocab);
  }
);

export const listVocabularyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = filterVocabularySchema.parse(req.query);
    const vocabList = await listVocabulary(filters);
    res.json(vocabList);
  }
);

export const updateVocabularyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = updateVocabularySchema.parse(req.body);
    const vocab = await updateVocabulary(req.params.id, payload);
    res.json(vocab);
  }
);

export const deleteVocabularyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteVocabulary(req.params.id);
    res.status(204).send();
  }
);

export const getVocabularyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { getVocabularyById } = await import("./vocab.service");
    const vocab = await getVocabularyById(req.params.id);
    res.json(vocab);
  }
);

export const checkDuplicateHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { word } = req.query;
    if (!word || typeof word !== "string") {
      res.json({ exists: false, word: null });
      return;
    }
    const { checkDuplicateWord } = await import("./vocab.service");
    const existingWord = await checkDuplicateWord(word);
    res.json({ exists: !!existingWord, word: existingWord });
  }
);
