
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  type: { type: String, enum: ["sale", "rent"], required: true },
  category: { type: String, enum: ["house", "apartment", "land", "commercial"], default: "house" },
  beds: Number,
  baths: Number,
  area: Number, // sqm
  address: String,
  city: String,
  state: String,
  pincode: String,
  lat: Number,
  lng: Number,
  images: [String], // Cloudinary URLs
  features: [String],
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["active", "sold", "rented", "draft"], default: "active" },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

propertySchema.index({ title: "text", city: "text", address: "text" });

export default mongoose.model("Property", propertySchema);
