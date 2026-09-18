import express from "express";
import protect, { allowRoles } from "../middleware/auth.js";
import { listNotifications, createNotification, markRead } from "../controllers/notificationController.js";

const router = express.Router();
router.use(protect);
router.get("/", listNotifications);
router.post("/", allowRoles("placement_officer", "admin"), createNotification);
router.patch("/:notificationId/read", markRead);
export default router;
