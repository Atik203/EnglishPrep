import mongoose from "mongoose";
import { env } from "../config/env";
import { UserModel } from "../modules/auth/user.model";

/**
 * Seed admin user into database
 * Admin credentials:
 * Email: admin@vocabprep.com
 * Password: admin123
 */
async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
    });
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({
      email: "admin@vocabprep.com",
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Is Admin:", existingAdmin.isAdmin);
      await mongoose.disconnect();
      return;
    }

    // Create admin user (password will be hashed by pre-save hook)
    const adminUser = await UserModel.create({
      name: "Admin User",
      email: "admin@vocabprep.com",
      password: "admin123",
      isAdmin: true,
      subscriptionTier: "premium",
      aiRequestsRemaining: 100,
      aiResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });

    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email: admin@vocabprep.com");
    console.log("🔑 Password: admin123");
    console.log("👑 Role: Admin");
    console.log("💎 Tier: Premium");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

// Run the seeder
seedAdmin();
