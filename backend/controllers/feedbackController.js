import { validationResult } from "express-validator";
import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

export const getFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};
