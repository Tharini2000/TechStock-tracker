import express from "express";
import { body } from "express-validator";
import {
  createContactSupport,
  getContactSupports,
  getMyContactSupports,
  replyContactSupport
} from "../controllers/contactSupportController.js";
import {
  authorizeRoles,
  optionalProtect,
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  optionalProtect,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Message should be at least 5 characters")
  ],
  createContactSupport
);

router.get("/", protect, authorizeRoles("admin"), getContactSupports);
router.get("/my", protect, authorizeRoles("customer", "admin"), getMyContactSupports);
router.patch(
  "/:id/reply",
  protect,
  authorizeRoles("admin"),
  [
    body("replyMessage")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Reply message should be at least 2 characters")
  ],
  replyContactSupport
);

export default router;
