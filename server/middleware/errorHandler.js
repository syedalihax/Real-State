
// 404 handler
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Not found - ${req.originalUrl}` });
};

// Global error handler — server never crashes
export const errorHandler = (err, req, res, next) => {
  console.error("❌", err.message);
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ID format: ${err.value}` });
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(", ") });
  }
  // Duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate value — already exists" });
  }
  res.status(err.statusCode || 500).json({ message: err.message || "Server error" });
};
