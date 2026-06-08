import dns from "node:dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Admin } from "../models/Admin.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../..", ".env") });

const username = process.argv[2] || "admin";
const newPassword = process.argv[3] || "Lanwebanu@#34";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not set in .env");
  }
  await mongoose.connect(process.env.MONGO_URI);
};

const run = async () => {
  try {
    await connectDB();
    console.log(`Connected to MongoDB for admin password reset.`);

    const admin = await Admin.findOne({ username });
    if (admin) {
      admin.password = newPassword;
      await admin.save();
      console.log(`Updated password for admin user '${username}'.`);
    } else {
      const created = new Admin({ username, password: newPassword });
      await created.save();
      console.log(`Created new admin user '${username}' with the provided password.`);
    }
  } catch (err) {
    console.error("Error resetting admin password:", err.message || err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

run();
