import express from "express";
import protect, { allowRoles } from "../middleware/auth.js";
import { listOpenJobs } from "../controllers/jobController.js";

const router = express.Router();
router.get("/", protect, allowRoles("student", "placement_officer", "recruiter", "admin"), listOpenJobs);
export default router;
