
# 🏠 RealEstate — MERN + Cloudinary (realestate.com.au style)

Full-stack real estate platform with a complete **Admin Panel**.

## Tech Stack
- **Frontend:** React 18, Vite, React Router 6, Axios, **Leaflet Maps (react-leaflet)**
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Images:** Cloudinary (multer-storage-cloudinary)
- **Auth:** JWT + bcrypt
- **Email:** Nodemailer (inquiry alerts to admin)

## Features

**Website**
- Hero search (buy/rent, city, price, beds) · Featured properties
- Listings with **pagination**, filters (type, city, price range, beds, baths, category, text search) and **sorting** (newest, price ↑↓, most viewed)
- Property detail: image gallery, view counter, feature tags, **agent card**, **interactive map** (OpenStreetMap via Leaflet), enquiry form
- **Similar properties** recommendations
- **Favourites / wishlist** — ❤️ toggle on cards, saved homes page
- Toast notifications · User register/login · Footer

**Admin Panel (`/admin`)**
- Dashboard stats (properties, users, inquiries, sold, portfolio value)
- Add/Edit/Delete properties with **Cloudinary multi-image upload**
- Optional **lat/lng** for map display (Google Maps → right-click → copy coords)
- Status management (active/sold/rented/draft), featured toggle
- Inquiries inbox with status workflow — **email notification** on new inquiry
- User management (roles, promote/demote admin)

## Setup

### 1. Backend
```bash
cd server
cp .env.example .env       # Mongo URI + Cloudinary keys + optional SMTP
npm install
node seed.js               # optional: demo data + admin account
npm run dev                # http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev                # http://localhost:3000
```

## Admin Login (after seed)
- Email: `admin@realestate.com`
- Password: `admin123`

## Cloudinary Setup
1. Create free account at cloudinary.com
2. Dashboard → copy **Cloud Name, API Key, API Secret**
3. Paste into `server/.env`

## Email Setup (optional — for inquiry alerts)
1. Gmail account → enable 2FA → generate an **App Password**
2. Set `SMTP_USER` and `SMTP_PASS` in `server/.env`
3. App works fine without it — emails just get skipped

## Map Setup
Admin panel mein property add karte waqt Google Maps se **lat/lng** paste karein.
Example (Sydney CBD): lat `-33.8688`, lng `151.2093`

## API Summary
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register · /login | public |
| GET | /api/properties (paginated, sort, filters) | public |
| GET | /api/properties/:id (auto-increments views) | public |
| GET | /api/properties/:id/similar | public |
| POST | /api/properties (multipart images) | admin |
| PUT/DELETE | /api/properties/:id | admin |
| POST | /api/inquiries (+ admin email alert) | public |
| GET/PATCH/DELETE | /api/inquiries | admin |
| GET/POST | /api/favourites · /api/favourites/ids | logged-in user |
| GET | /api/admin/stats · /properties · /users | admin |
