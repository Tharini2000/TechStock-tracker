import { validationResult } from "express-validator";
import ContactSupport from "../models/ContactSupport.js";

export const createContactSupport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    };

    if (req.user) {
      payload.customerId = req.user._id;
      payload.name = req.user.name;
      payload.email = req.user.email;
    }

    const supportRequest = await ContactSupport.create(payload);
    res.status(201).json(supportRequest);
  } catch (error) {
    next(error);
  }
};

export const getContactSupports = async (req, res, next) => {
  try {
    const supportRequests = await ContactSupport.find()
      .populate("customerId", "name email")
      .populate("adminReply.repliedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(supportRequests);
  } catch (error) {
    next(error);
  }
};

export const replyContactSupport = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const supportRequest = await ContactSupport.findById(req.params.id);
    if (!supportRequest) {
      return res.status(404).json({ message: "Support request not found" });
    }

    supportRequest.adminReply = {
      message: req.body.replyMessage,
      repliedBy: req.user._id,
      repliedAt: new Date()
    };
    supportRequest.status = "replied";

    await supportRequest.save();

    const updated = await ContactSupport.findById(supportRequest._id)
      .populate("customerId", "name email")
      .populate("adminReply.repliedBy", "name email");

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getMyContactSupports = async (req, res, next) => {
  try {
    const supportRequests = await ContactSupport.find({
      $or: [{ customerId: req.user._id }, { email: req.user.email }]
    })
      .populate("adminReply.repliedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(supportRequests);
  } catch (error) {
    next(error);
  }
};
