import express from "express";
import protect, { allowRoles } from "../middleware/auth.js";
import { listStudentInterviews } from "../controllers/interviewController.js";

const router = express.Router();
router.use(protect, allowRoles("student"));
router.get("/me", listStudentInterviews);
export default router;
