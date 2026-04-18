import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import seedDefaultCategories from "./config/seedDefaultCategories.js";

dotenv.config();

const createAdminUser = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Seed default categories
    await seedDefaultCategories();
    console.log("✅ Default categories created");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@techstock.com" });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists");
      console.log("Email: admin@techstock.com");
      console.log("Password: Admin@123");
      await mongoose.disconnect();
      return;
    }

    // Create new admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@techstock.com",
      password: "Admin@123",
      role: "admin"
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n--- Login Credentials ---");
    console.log("Email: admin@techstock.com");
    console.log("Password: Admin@123");
    console.log("Role: admin");
    console.log("------------------------\n");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdminUser();
