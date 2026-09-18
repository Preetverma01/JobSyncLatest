import express from "express";
import protect, { allowRoles } from "../middleware/auth.js";
import { getRecruiterDashboard, getCompany, saveCompany, listJobs, createJob, getRecommendations, listApplications, updateApplication, scheduleInterview, listInterviews, submitFeedback } from "../controllers/recruiterController.js";

const router = express.Router();
router.use(protect, allowRoles("recruiter", "admin"));
router.get("/dashboard", getRecruiterDashboard);
router.get("/company", getCompany);
router.put("/company", saveCompany);
router.get("/jobs", listJobs);
router.post("/jobs", createJob);
router.get("/jobs/:jobId/recommendations", getRecommendations);
router.get("/applications", listApplications);
router.patch("/applications/:applicationId", updateApplication);
router.post("/interviews", scheduleInterview);
router.get("/interviews", listInterviews);
router.post("/feedback", submitFeedback);
export default router;
