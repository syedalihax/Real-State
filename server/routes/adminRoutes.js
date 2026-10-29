
import express from "express";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Inquiry from "../models/Inquiry.js";
import { protect, adminOnly } from "../middleware/auth.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.use(protect, adminOnly);

// Dashboard stats
router.get("/stats", asyncHandler(async (req, res) => {
  const [totalProperties, totalUsers, totalInquiries, sold, totalValue] = await Promise.all([
    Property.countDocuments(),
    User.countDocuments(),
    Inquiry.countDocuments(),
    Property.countDocuments({ status: "sold" }),
    Property.aggregate([{ $group: { _id: null, sum: { $sum: "$price" } } }]),
  ]);
  res.json({ totalProperties, totalUsers, totalInquiries, sold, totalValue: totalValue[0]?.sum || 0 });
}));

// All properties (any status)
router.get("/properties", asyncHandler(async (req, res) => {
  res.json(await Property.find().sort("-createdAt"));
}));

// Users management
router.get("/users", asyncHandler(async (req, res) => {
  res.json(await User.find().select("-password"));
}));

router.patch("/users/:id/role", asyncHandler(async (req, res) => {
  res.json(await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-password"));
}));

router.delete("/users/:id", asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
}));

export default router;
