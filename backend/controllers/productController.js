import { validationResult } from "express-validator";
import Product from "../models/Product.js";

const buildFilter = (query) => {
  const filter = {};

  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }

  if (query.category) {
    filter.category = query.category;
  }

  return filter;
};

const getNextProductIdValue = async () => {
  const latest = await Product.findOne({ productId: { $regex: /^P-\d{3}$/ } })
    .sort({ productId: -1 })
    .select("productId")
    .lean();

  if (!latest || !latest.productId) {
    return "P-001";
  }

  const current = parseInt(latest.productId.replace(/^P-/, ""), 10);
  const next = isNaN(current) ? 1 : current + 1;
  return `P-${String(next).padStart(3, "0")}`;
};

export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = {
      ...req.body,
      productId: req.body.productId || (await getNextProductIdValue())
    };

    const existing = await Product.findOne({ productId: payload.productId });
    if (existing) {
      return res.status(409).json({ message: "Product ID already exists" });
    }

    const product = await Product.create(payload);
    const populated = await product.populate("category", "categoryName");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getNextProductId = async (req, res, next) => {
  try {
    const nextId = await getNextProductIdValue();
    res.status(200).json({ nextProductId: nextId });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);
    const products = await Product.find(filter).populate("category", "categoryName").sort({ createdAt: -1 });

    res.status(200).json({
      items: products,
      summary: {
        totalProducts: products.length,
        lowStockProducts: products.filter((p) => p.quantity < 25).length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "categoryName");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatePayload = { ...req.body };
    delete updatePayload.productId;

    const product = await Product.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true
    }).populate("category", "categoryName");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};