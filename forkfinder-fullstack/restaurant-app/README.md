# 🍽️ ForkFinder — Restaurant Discovery Platform

A full-stack MERN application that detects your real-time location, fetches live nearby restaurants from OpenStreetMap, and serves personalized recommendations using a weighted scoring algorithm.

---

## 🚀 Live Demo

- **Frontend**: Deploy to Vercel → `https://forkfinder.vercel.app`
- **Backend**: Deploy to Render → `https://forkfinder-api.onrender.com`

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Vanilla CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Maps | Leaflet + react-leaflet |
| Real Data | OpenStreetMap Overpass API |
| HTTP | Axios with interceptors |
| Deployment | Vercel (FE) + Render (BE) + MongoDB Atlas (DB) |

---

## 📁 Project Structure

```
restaurant-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js       # Register, login, getMe
│   │   │   ├── restaurant.controller.js # CRUD + nearby + recommend
│   │   │   └── user.controller.js       # Favorites + preferences
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js       # JWT protect middleware
│   │   ├── models/
│   │   │   ├── User.model.js            # User schema + bcrypt hooks
│   │   │   └── Restaurant.model.js      # Restaurant schema + geo index
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── restaurant.routes.js
│   │   │   └── user.routes.js
│   │   ├── services/
│   │   │   ├── overpass.service.js      # OpenStreetMap integration + caching
│   │   │   └── recommendation.service.js # Weighted scoring algorithm
│   │   └── server.js                    # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── RestaurantCard.jsx
    │   │   ├── FilterBar.jsx
    │   │   ├── MapComponent.jsx         # Leaflet map wrapper
    │   │   └── Loader.jsx               # Skeleton + spinner
    │   ├── context/
    │   │   └── AuthContext.jsx          # Global auth state
    │   ├── hooks/
    │   │   └── useGeolocation.js        # Browser geolocation hook
    │   ├── pages/
    │   │   ├── Home.jsx                 # Hero + nearby + map
    │   │   ├── Explore.jsx              # Grid + filters + pagination
    │   │   ├── RestaurantDetail.jsx     # Detail + Leaflet map
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx             # With cuisine preference picker
    │   │   └── Profile.jsx              # Favorites + recommendations
    │   ├── styles/
    │   │   ├── global.css               # Variables, base, buttons, grid
    │   │   ├── components.css           # Navbar, cards, filters, auth, skeleton
    │   │   └── pages.css                # Hero, explore, detail, profile
    │   ├── utils/
    │   │   ├── api.js                   # Axios instance + interceptors
    │   │   └── helpers.js               # Image mapping, formatters
    │   ├── App.jsx                      # Routes
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier is fine)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/forkfinder.git
cd forkfinder
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/restaurantapp
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

```bash
npm run dev
# Server starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

```bash
npm run dev
# App starts on http://localhost:3000
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Create account |
| POST | `/api/v1/auth/login` | Public | Get JWT token |
| GET | `/api/v1/auth/me` | Protected | Get current user |

### Restaurants
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/restaurants` | Public | List with filters + pagination |
| GET | `/api/v1/restaurants/nearby?lat=&lng=` | Public | Fetch from Overpass + cache |
| GET | `/api/v1/restaurants/:id` | Public | Single restaurant |
| GET | `/api/v1/restaurants/recommend` | Protected | Personalized list |

### User
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/user/favorites/:id` | Protected | Toggle favorite |
| GET | `/api/v1/user/favorites` | Protected | Get favorites list |
| PUT | `/api/v1/user/preferences` | Protected | Update cuisine/price prefs |

### Standard Response Format
```json
{
  "success": true,
  "message": "Description of result",
  "data": { ... }
}
```

---

## 🤖 Recommendation Algorithm

The scoring engine lives in `backend/src/services/recommendation.service.js`.

```
Score = (Cuisine Match × 0.5) + (Normalized Rating × 0.3) + (Price Compatibility × 0.2)
```

| Component | Weight | Logic |
|-----------|--------|-------|
| Cuisine Match | 50% | 1.0 if restaurant cuisine matches any user preference, else 0 (0.5 neutral if no prefs set) |
| Normalized Rating | 30% | (rating − 1) / 4 → scales 1–5 to 0–1 |
| Price Compatibility | 20% | 1.0 for exact match, 0.6 for ±1 tier, 0.3 for ±2, 0.0 for ±3 |

Restaurants are sorted by descending score. The top 20 are returned.

---

## 🌍 OpenStreetMap Integration

The Overpass API is queried with a bounding box around the user's coordinates:

```
node["amenity"="restaurant"](south,west,north,east);
```

**Caching strategy:** If MongoDB already has restaurants within 1km of the requested location cached within the last 10 minutes, the Overpass API is skipped entirely. This avoids rate-limiting and improves response times significantly.

---

## 🚀 Deployment

### Backend → Render
1. Push code to GitHub
2. Create new **Web Service** on Render
3. Set root directory to `backend/`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env`

### Frontend → Vercel
1. Import GitHub repo on Vercel
2. Set root directory to `frontend/`
3. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com/api/v1`
4. Deploy

### Database → MongoDB Atlas
1. Create free M0 cluster
2. Add IP `0.0.0.0/0` to network access (for Render)
3. Create database user
4. Copy connection string to `MONGO_URI`

---

## 📈 Scaling into a Startup (Zomato/Swiggy model)

This architecture already supports the core of a food-tech product. Here's the roadmap:

### Phase 1 — Polish (Week 3–4)
- Add restaurant reviews + star ratings stored in MongoDB
- Add photo upload via Cloudinary
- PWA support for mobile installs

### Phase 2 — Growth (Month 2–3)
- Switch recommendation engine to collaborative filtering (users who liked X also liked Y)
- Add restaurant owner dashboard (claim & manage listing)
- Integrate Google Places API for richer data (photos, opening hours)

### Phase 3 — Monetization (Month 4+)
- Add delivery integration (Dunzo/Shiprocket API)
- Premium listings for restaurants (sponsored cards)
- Table reservation system
- ML-powered ETA prediction

---

## 🛠️ Future Improvements

- [ ] Real-time order tracking with Socket.io
- [ ] ElasticSearch for fuzzy restaurant name search
- [ ] Redis for caching hot recommendations
- [ ] React Query for server-state management
- [ ] End-to-end tests with Playwright
- [ ] Docker + docker-compose for dev environment

---

## 👨‍💻 Author

Built as a full-stack internship portfolio project demonstrating:
- MERN stack architecture
- Third-party API integration (OpenStreetMap)
- JWT authentication
- Geospatial queries (MongoDB 2dsphere)
- Content-based recommendation systems
- Production deployment pipeline
