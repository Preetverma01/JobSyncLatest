import express from "express";
import protect, { allowRoles } from "../middleware/auth.js";
import { getTpoDashboard, listStudents, getStudentProfile, listDrives, createDrive, getDriveEligibility, updateDrive } from "../controllers/tpoController.js";

const router = express.Router();
router.use(protect, allowRoles("placement_officer", "admin"));
router.get("/dashboard", getTpoDashboard);
router.get("/students", listStudents);
router.get("/students/:studentId", getStudentProfile);
router.get("/drives", listDrives);
router.post("/drives", createDrive);
router.get("/drives/:driveId/eligibility", getDriveEligibility);
router.patch("/drives/:driveId", updateDrive);
export default router;
