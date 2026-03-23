import express from "express";
import { placeOrder, getOrders, updateOrder, deleteOrder } from "../controllers/orderController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

router.patch("/:id/status", protect, authorizeRoles("admin"), updateOrder);

export default router;
