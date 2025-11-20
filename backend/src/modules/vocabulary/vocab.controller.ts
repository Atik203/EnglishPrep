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
