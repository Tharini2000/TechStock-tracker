import express from "express";
import { getAdminDashboard, getInventoryReport, getPurchaseReport } from "../controllers/reportController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/inventory", protect, authorizeRoles("admin"), getInventoryReport);
router.get("/purchases", protect, authorizeRoles("admin"), getPurchaseReport);
router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);

export default router;
