import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getInventoryReport = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.quantity < 25);
    const inventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    res.status(200).json({
      summary: {
        totalProducts,
        lowStockProducts: lowStockProducts.length,
        inventoryValue
      },
      items: products
    });
  } catch (error) {
    next(error);
  }
};

export const getPurchaseReport = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.product", "name")
      .sort({ orderDate: -1 });

    const summary = {
      totalOrders: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      approved: orders.filter((o) => o.status === "approved").length,
      completed: orders.filter((o) => o.status === "completed").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
      revenue: orders
        .filter((o) => o.status === "approved" || o.status === "completed")
        .reduce((sum, o) => sum + o.totalPrice, 0)
    };

    res.status(200).json({ summary, items: orders });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (req, res, next) => {
  try {
    const [products, orders] = await Promise.all([
      Product.find().sort({ createdAt: -1 }),
      Order.find().sort({ orderDate: -1 }).limit(8).populate("userId", "name")
    ]);

    res.status(200).json({
      cards: {
        totalProducts: products.length,
        lowStockProducts: products.filter((p) => p.quantity < 25).length,
        recentOrders: orders.length,
        inventorySummary: products.reduce((sum, p) => sum + p.quantity, 0)
      },
      recentOrders: orders
    });
  } catch (error) {
    next(error);
  }
};