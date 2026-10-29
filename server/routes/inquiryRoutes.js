
import express from "express";
import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sendInquiryEmail } from "../utils/sendEmail.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// Public: submit inquiry (+ email admin)
router.post("/", asyncHandler(async (req, res) => {
  const { property, name, email, phone, message } = req.body;
  const prop = await Property.findById(property);
  if (!prop) return res.status(404).json({ message: "Property not found" });

  const inquiry = await Inquiry.create({ property, name, email, phone, message });

  // notify admin by email (non-blocking — app works even without SMTP)
  User.findOne({ role: "admin" }).then((admin) => {
    if (admin?.email) {
      sendInquiryEmail({ to: admin.email, propertyTitle: prop.title, inquirer: { name, email, phone }, message }).catch(console.error);
    }
  });

  res.status(201).json({ message: "Inquiry submitted", inquiry });
}));

// Admin: list & manage
router.get("/", protect, adminOnly, asyncHandler(async (req, res) => {
  res.json(await Inquiry.find().populate("property", "title price").sort("-createdAt"));
}));

router.patch("/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  res.json(await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true }));
}));

router.delete("/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  await Inquiry.findByIdAndDelete(req.params.id);
  res.json({ message: "Inquiry deleted" });
}));

export default router;
