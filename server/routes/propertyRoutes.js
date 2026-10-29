
import express from "express";
import mongoose from "mongoose";
import Property from "../models/Property.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: `Invalid property ID: "${req.params.id}"` });
  }
  next();
};

// GET /api/properties?type=&city=&minPrice=&maxPrice=&beds=&baths=&category=&search=&sort=&page=&limit=
router.get("/", asyncHandler(async (req, res) => {
  const { type, city, minPrice, maxPrice, beds, baths, category, search, sort, page = 1, limit = 12 } = req.query;
  const q = { status: "active" };
  if (type) q.type = type;
  if (category) q.category = category;
  if (city) q.city = new RegExp(city, "i");
  if (beds) q.beds = { $gte: Number(beds) };
  if (baths) q.baths = { $gte: Number(baths) };
  if (minPrice || maxPrice) {
    q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
  }
  if (search) q.$text = { $search: search };

  const sortMap = {
    newest: { featured: -1, createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    popular: { views: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [properties, total] = await Promise.all([
    Property.find(q).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Property.countDocuments(q),
  ]);
  res.json({ properties, total, pages: Math.ceil(total / Number(limit)), page: Number(page) });
}));

router.get("/featured", asyncHandler(async (req, res) => {
  res.json(await Property.find({ featured: true, status: "active" }).limit(6));
}));

// GET similar properties
router.get("/:id/similar", validId, asyncHandler(async (req, res) => {
  const p = await Property.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Property not found" });
  const similar = await Property.find({
    _id: { $ne: p._id },
    status: "active",
    $or: [{ city: p.city }, { type: p.type, category: p.category }],
  }).limit(4);
  res.json(similar);
}));

router.get("/:id", validId, asyncHandler(async (req, res) => {
  const p = await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate("agent", "name email phone");
  if (!p) return res.status(404).json({ message: "Property not found" });
  res.json(p);
}));

// Admin: create with Cloudinary images
router.post("/", protect, adminOnly, upload.array("images", 10), asyncHandler(async (req, res) => {
  const images = req.files?.map((f) => f.path) || [];
  const body = { ...req.body, images, agent: req.user._id };
  if (body.features) body.features = body.features.split(",").map((s) => s.trim());
  ["price", "beds", "baths", "area", "lat", "lng"].forEach((k) => body[k] !== undefined && body[k] !== "" && (body[k] = Number(body[k])));
  const property = await Property.create(body);
  res.status(201).json(property);
}));

// Admin: update
router.put("/:id", protect, adminOnly, validId, upload.array("images", 10), asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (req.files?.length) updates.images = req.files.map((f) => f.path);
  if (updates.features) updates.features = updates.features.split(",").map((s) => s.trim());
  ["price", "beds", "baths", "area", "lat", "lng"].forEach((k) => updates[k] !== undefined && updates[k] !== "" && (updates[k] = Number(updates[k])));
  const property = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json(property);
}));

// Admin: delete
router.delete("/:id", protect, adminOnly, validId, asyncHandler(async (req, res) => {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json({ message: "Property deleted" });
}));

export default router;
