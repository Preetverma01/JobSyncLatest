import { Router } from "express";
import upload from "../middlewares/upload.js";
import { analyzeResume } from "../controllers/analyzeController.js";

const router = Router();

router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;
