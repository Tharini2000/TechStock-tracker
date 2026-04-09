import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const startOfMonth = () => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const mapOrderStats = async () => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: "$userId",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalPrice" },
        lastOrderDate: { $max: "$orderDate" }
      }
    }
  ]);

  return new Map(stats.map((stat) => [String(stat._id), stat]));
};

export const getCustomerReport = async (req, res, next) => {
  try {
    const [customers, orderStats] = await Promise.all([
      User.find({ role: "customer" })
        .select("name email createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      mapOrderStats()
    ]);

    const monthStart = startOfMonth();

    const items = customers.map((customer) => {
      const stats = orderStats.get(String(customer._id)) || {};

      return {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        joinedAt: customer.createdAt,
        totalOrders: stats.totalOrders || 0,
        totalSpent: stats.totalSpent || 0,
        lastOrderDate: stats.lastOrderDate || null
      };
    });

    const summary = {
      totalCustomers: items.length,
      activeCustomers: items.filter((customer) => customer.totalOrders > 0).length,
      newThisMonth: customers.filter((customer) => customer.createdAt >= monthStart).length,
      totalOrders: items.reduce((sum, customer) => sum + customer.totalOrders, 0),
      totalSpent: items.reduce((sum, customer) => sum + customer.totalSpent, 0)
    };

    res.status(200).json({ summary, items });
  } catch (error) {
    next(error);
  }
};

export const getProductReport = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category", "categoryName")
      .sort({ createdAt: -1 })
      .lean();

    const summary = {
      totalProducts: products.length,
      availableProducts: products.filter((product) => product.quantity > 0).length,
      lowStockProducts: products.filter((product) => product.quantity < 25).length,
      outOfStockProducts: products.filter((product) => product.quantity === 0).length,
      inventoryValue: products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      )
    };

    const items = products.map((product) => ({
      _id: product._id,
      productId: product.productId,
      name: product.name,
      categoryName: product.category?.categoryName || "Uncategorized",
      quantity: product.quantity,
      price: product.price,
      stockStatus:
        product.quantity === 0
          ? "Out of Stock"
          : product.quantity < 25
            ? "Low Stock"
            : "Available",
      createdAt: product.createdAt
    }));

    res.status(200).json({ summary, items });
  } catch (error) {
    next(error);
  }
};

export const getInventoryReport = getProductReport;

export const getCategoryReport = async (req, res, next) => {
  try {
    const [categories, products] = await Promise.all([
      Category.find().sort({ createdAt: -1 }).lean(),
      Product.find().select("category quantity price").lean()
    ]);

    const categoryStats = products.reduce((acc, product) => {
      const key = String(product.category);
      const current = acc.get(key) || {
        productCount: 0,
        availableStock: 0,
        inventoryValue: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0
      };

      current.productCount += 1;
      current.availableStock += product.quantity;
      current.inventoryValue += product.quantity * product.price;

      if (product.quantity === 0) {
        current.outOfStockProducts += 1;
      }

      if (product.quantity < 25) {
        current.lowStockProducts += 1;
      }

      acc.set(key, current);
      return acc;
    }, new Map());

    const items = categories.map((category) => {
      const stats = categoryStats.get(String(category._id)) || {};

      return {
        _id: category._id,
        categoryName: category.categoryName,
        description: category.description || "",
        productCount: stats.productCount || 0,
        availableStock: stats.availableStock || 0,
        lowStockProducts: stats.lowStockProducts || 0,
        outOfStockProducts: stats.outOfStockProducts || 0,
        inventoryValue: stats.inventoryValue || 0
      };
    });

    const summary = {
      totalCategories: categories.length,
      categoriesWithProducts: items.filter((item) => item.productCount > 0).length,
      emptyCategories: items.filter((item) => item.productCount === 0).length,
      totalProducts: products.length,
      totalInventoryValue: items.reduce((sum, item) => sum + item.inventoryValue, 0)
    };

    res.status(200).json({ summary, items });
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
    const [products, orders, customers, categories] = await Promise.all([
      Product.find().sort({ createdAt: -1 }),
      Order.find().sort({ orderDate: -1 }).limit(8).populate("userId", "name"),
      User.countDocuments({ role: "customer" }),
      Category.countDocuments()
    ]);

    res.status(200).json({
      cards: {
        totalProducts: products.length,
        lowStockProducts: products.filter((p) => p.quantity < 25).length,
        recentOrders: orders.length,
        inventorySummary: products.reduce((sum, p) => sum + p.quantity, 0),
        totalCustomers: customers,
        totalCategories: categories
      },
      recentOrders: orders
    });
  } catch (error) {
    next(error);
  }
};
