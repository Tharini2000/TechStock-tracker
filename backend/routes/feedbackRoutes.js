import express from "express";
import { body } from "express-validator";
import { createFeedback, getFeedbacks } from "../controllers/feedbackController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5")
  ],
  createFeedback
);

router.get("/", protect, authorizeRoles("admin"), getFeedbacks);

export default router;
