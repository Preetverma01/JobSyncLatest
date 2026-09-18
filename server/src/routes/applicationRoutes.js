import express from "express";
import protect, { allowRoles } from "../middleware/auth.js";
import { applyToJob, listMyApplications } from "../controllers/applicationController.js";

const router = express.Router();
router.use(protect, allowRoles("student"));
router.get("/me", listMyApplications);
router.post("/jobs/:jobId", applyToJob);
export default router;
