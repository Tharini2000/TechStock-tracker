import express from "express";
import { body } from "express-validator";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from "../controllers/categoryController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCategories);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  [body("categoryName").notEmpty().withMessage("Category name is required")],
  createCategory
);

router.put("/:id", protect, authorizeRoles("admin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);

export default router;
