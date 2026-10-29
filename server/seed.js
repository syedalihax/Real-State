
// Run once: node seed.js
// Creates ONLY the admin account. No dummy listings — import your real data separately.
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany({});
// NOTE: properties are intentionally left untouched so your real data stays safe.
await User.create({ name: "Admin", email: "admin@realestate.com", password: "admin123", role: "admin" });

console.log("✅ Admin created: admin@realestate.com / admin123");
console.log("ℹ️  No sample properties were created — import your real listings via the admin panel.");
process.exit(0);
