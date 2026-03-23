import express from "express";
import { body } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);

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
