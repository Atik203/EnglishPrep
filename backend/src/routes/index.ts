import { Router } from "express";
import practiceRoutes from "../modules/practice/practice.routes";
import tenseRoutes from "../modules/tenses/tenses.routes";
import vocabularyRoutes from "../modules/vocabulary/vocab.routes";

const router = Router();

router.use("/vocab", vocabularyRoutes);
router.use("/practices", practiceRoutes);
router.use("/tenses", tenseRoutes);

export default router;
