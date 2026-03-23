import { validationResult } from "express-validator";
import PurchaseRequest from "../models/PurchaseRequest.js";
import Product from "../models/Product.js";

export const createPurchaseRequest = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { product, quantity, reason } = req.body;
    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const request = await PurchaseRequest.create({
      user: req.user._id,
      product,
      quantity,
      reason
    });

    const populated = await request.populate([
      { path: "user", select: "name email" },
      { path: "product", select: "productName quantity" }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getPurchaseRequests = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };

    const requests = await PurchaseRequest.find(filter)
      .populate("user", "name email")
      .populate("product", "productName quantity")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const request = await PurchaseRequest.findById(req.params.id).populate("product");
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (status === "approved") {
      if (request.product.quantity < request.quantity) {
        return res.status(400).json({ message: "Insufficient stock for approval" });
      }
      request.product.quantity -= request.quantity;
      await request.product.save();
    }

    request.status = status;
    await request.save();

    const updated = await request.populate([
      { path: "user", select: "name email" },
      { path: "product", select: "productName quantity" }
    ]);

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
