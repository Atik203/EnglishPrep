import { Router } from "express";
import { listTensesHandler } from "./tenses.controller";

const router = Router();

router.get("/", listTensesHandler);

export default router;
