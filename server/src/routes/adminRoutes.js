import express from "express";
import protect, { allowRoles } from "../middleware/auth.js";
import { getAdminDashboard, listUsers, updateUserRole, listCompanies } from "../controllers/adminController.js";

const router = express.Router();
router.use(protect, allowRoles("admin"));
router.get("/dashboard", getAdminDashboard);
router.get("/users", listUsers);
router.patch("/users/:userId/role", updateUserRole);
router.get("/companies", listCompanies);
export default router;
