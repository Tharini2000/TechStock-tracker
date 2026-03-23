import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

const canModifyOrder = (orderDate) => {
  return Date.now() - new Date(orderDate).getTime() <= SIX_HOURS_MS;
};

export const placeOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({ message: `Product no longer exists: ${item.product._id}` });
      }

      if (item.quantity > product.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      product.quantity -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      totalPrice += item.quantity * product.price;
    }

    const order = await Order.create({
      userId: req.user._id,
      products: orderItems,
      totalPrice,
      orderDate: new Date(),
      status: "pending"
    });

    cart.items = [];
    await cart.save();

    const populated = await Order.findById(order._id)
      .populate("userId", "name email")
      .populate("products.product", "name price image category");

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? {} : { userId: req.user._id };

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .populate("products.product", "name price image")
      .sort({ orderDate: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.user.role !== "admin" && !canModifyOrder(order.orderDate)) {
      return res.status(400).json({ message: "Order can only be updated within 6 hours" });
    }

    if (req.user.role === "admin" && req.body.status) {
      order.status = req.body.status;
      await order.save();
      return res.status(200).json(order);
    }

    const requestedItems = req.body.products;
    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
      return res.status(400).json({ message: "Updated products are required" });
    }

    // Restore previous stock first, then apply new quantities.
    for (const existing of order.products) {
      const product = await Product.findById(existing.product._id);
      if (product) {
        product.quantity += existing.quantity;
        await product.save();
      }
    }

    const newOrderItems = [];
    let newTotal = 0;

    for (const item of requestedItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: "Product not found in update" });

      if (item.quantity > product.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      product.quantity -= item.quantity;
      await product.save();

      newOrderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
      newTotal += item.quantity * product.price;
    }

    order.products = newOrderItems;
    order.totalPrice = newTotal;
    await order.save();

    const populated = await Order.findById(order._id)
      .populate("userId", "name email")
      .populate("products.product", "name price image");

    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.user.role !== "admin" && !canModifyOrder(order.orderDate)) {
      return res.status(400).json({ message: "Order can only be deleted within 6 hours" });
    }

    for (const item of order.products) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    next(error);
  }
};
