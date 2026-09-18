import express from "express";
import protect, { allowRoles } from "../middleware/auth.js";
import { getPlacementReport } from "../controllers/reportController.js";

const router = express.Router();
router.use(protect, allowRoles("placement_officer", "admin"));
router.get("/placement", getPlacementReport);
export default router;
