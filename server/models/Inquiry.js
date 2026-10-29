
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: String,
  status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
}, { timestamps: true });

export default mongoose.model("Inquiry", inquirySchema);
