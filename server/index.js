
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import Property from "./models/Property.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const requiredEnv = ["MONGO_URI"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  if (isProduction) process.exit(1);
}

connectDB();

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.SITE_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || !isProduction) return callback(null, true);
    return callback(new Error("CORS blocked by server policy"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// Dynamic sitemap.xml — all active listings + static pages
app.get("/sitemap.xml", async (req, res) => {
  const baseUrl = process.env.SITE_URL || "https://yourdomain.com";
  const staticPages = ["", "/listings", "/login", "/register"];
  const properties = await Property.find({ status: "active" }).select("_id updatedAt");
  const urls = [
    ...staticPages.map((p) => `<url><loc>${baseUrl}${p}</loc><changefreq>daily</changefreq></url>`),
    ...properties.map((p) =>
      `<url><loc>${baseUrl}/property/${p._id}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq></url>`
    ),
  ].join("");
  res.set("Content-Type", "application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
});

// ---------- PRODUCTION: serve built client + SPA fallback ----------
const clientDist = path.resolve(process.cwd(), "../client/dist");
const hasBuild = fs.existsSync(path.join(clientDist, "index.html"));

if (hasBuild) {
  app.use(express.static(clientDist));
  // Any non-API GET request → serve index.html (deep links & refreshes work)
  app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(clientDist, "index.html")));
} else {
  console.log("ℹ️  client/dist not found — running API-only mode (dev: use Vite on :3000)");
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
