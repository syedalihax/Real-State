
import express from "express";
import Favourite from "../models/Favourite.js";
import { protect } from "../middleware/auth.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.use(protect);

// GET my favourites
router.get("/", asyncHandler(async (req, res) => {
  const favs = await Favourite.find({ user: req.user._id }).populate("property");
  res.json(favs.map((f) => f.property).filter(Boolean));
}));

// GET my favourite property ids (lightweight, for heart states)
router.get("/ids", asyncHandler(async (req, res) => {
  const favs = await Favourite.find({ user: req.user._id }).select("property");
  res.json(favs.map((f) => f.property.toString()));
}));

// POST toggle favourite
router.post("/", asyncHandler(async (req, res) => {
  const { propertyId } = req.body;
  const existing = await Favourite.findOne({ user: req.user._id, property: propertyId });
  if (existing) {
    await existing.deleteOne();
    return res.json({ favourited: false });
  }
  await Favourite.create({ user: req.user._id, property: propertyId });
  res.json({ favourited: true });
}));

export default router;
