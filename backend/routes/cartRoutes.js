import express from "express";
import { body } from "express-validator";
import { addToCart, getCart, removeCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  [
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be positive")
  ],
  addToCart
);

router.get("/", protect, getCart);
router.delete("/:id", protect, removeCartItem);

export default router;
