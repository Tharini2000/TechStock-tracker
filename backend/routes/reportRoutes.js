import express from "express";
import {
  getAdminDashboard,
  getCategoryReport,
  getCustomerReport,
  getInventoryReport,
  getProductReport,
  getPurchaseReport
} from "../controllers/reportController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/customers", protect, authorizeRoles("admin"), getCustomerReport);
router.get("/products", protect, authorizeRoles("admin"), getProductReport);
router.get("/categories", protect, authorizeRoles("admin"), getCategoryReport);
router.get("/inventory", protect, authorizeRoles("admin"), getInventoryReport);
router.get("/purchases", protect, authorizeRoles("admin"), getPurchaseReport);
router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);

export default router;
