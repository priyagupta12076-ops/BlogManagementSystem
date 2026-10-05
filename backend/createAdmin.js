require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/blogmanagement";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB.");

    const adminEmail = process.argv[2] || "admin@blogsphere.com";
    const adminPassword = process.argv[3] || "admin123";
    const adminName = process.argv[4] || "System Admin";

    let existing = await User.findOne({ email: adminEmail.toLowerCase().trim() });

    if (existing) {
      existing.role = "admin";
      await existing.save();
      console.log(`Updated existing user [${existing.email}] with role: admin`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase().trim(),
        password: hashedPassword,
        role: "admin"
      });
      console.log(`Created new Admin account:
Email:    ${newAdmin.email}
Password: ${adminPassword}
Role:     ${newAdmin.role}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
