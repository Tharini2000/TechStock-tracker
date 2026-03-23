import { validationResult } from "express-validator";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

export const addToCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populated = await cart.populate("items.product", "name price image quantity category");

    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const populated = await cart.populate("items.product", "name price image quantity category");
    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.id);
    await cart.save();

    const populated = await cart.populate("items.product", "name price image quantity category");
    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};
