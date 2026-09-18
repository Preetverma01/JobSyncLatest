import express from "express";
import { uploadResume, analyzeResume, getAnalysisHistory, downloadResume } from "../controllers/resumeController.js";
import protect, { allowRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/upload", protect, uploadResume, (req, res) => {
  res.status(200).json({ success: true, message: "Resume uploaded successfully." });
});
router.post("/analyze", protect, uploadResume, analyzeResume);
router.get("/history", protect, getAnalysisHistory);
router.get("/:resumeId/download", protect, allowRoles("placement_officer", "recruiter", "admin"), downloadResume);

export default router;
