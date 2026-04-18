import express from "express";
import { body } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getNextProductId,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public endpoint - anyone can get next product ID (no auth required for display)
router.get("/next-id", getNextProductId);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("quantity").isInt({ min: 0 }).withMessage("Quantity must be non-negative"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be non-negative")
  ],
  createProduct
);

router.put("/:id", protect, authorizeRoles("admin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

export default router;
