# TravelBharat – Setup & Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm 9+

---

## Local Setup

### 1. Clone / open the project
```bash
cd e:\project\TravelBharat
```

### 2. Backend Setup
```bash
cd server
npm install

# Copy and configure env
cp .env.example .env
# Edit MONGO_URI if using MongoDB Atlas

# Seed the database (creates 6 states, 16 cities, 15 places + admin user)
npm run seed

# Start server (dev mode with nodemon)
npm run dev
# → http://localhost:5000
```

**Default Admin Credentials (created by seed):**
- Email: `admin@travelbharat.com`
- Password: `Admin@1234`

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
# → http://localhost:5173
```

### 4. Verify
- Open `http://localhost:5173` – see the TravelBharat homepage
- Open `http://localhost:5000/api/health` – see `{ success: true, message: "..." }`
- Go to `/admin/login` and sign in with admin credentials

---

## Environment Variables

### server/.env
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/travelbharat
JWT_SECRET=travelbharat_super_secret_jwt_key_2024
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@travelbharat.com
ADMIN_PASSWORD=Admin@1234
```

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Deployment

### Frontend → Vercel

1. Push `client/` folder to GitHub
2. Import repo into [vercel.com](https://vercel.com)
3. Set **Root Directory** to `client`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Push `server/` folder to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
4. Add environment variables (from `.env`) in Render dashboard
5. Use MongoDB Atlas URI for `MONGO_URI`
6. Deploy → copy the URL → paste into Vercel's `VITE_API_URL`

### MongoDB Atlas (Cloud)
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create database user + whitelist `0.0.0.0/0`
3. Copy connection string, replace `MONGO_URI` in backend env
4. Run seed: `npm run seed` against Atlas URI

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/states` | All states |
| GET | `/api/states/:id` | Single state |
| GET | `/api/cities?stateId=` | Cities (filter by state) |
| GET | `/api/places?search=&state=&city=&category=&featured=&page=&limit=` | Places with full filter |
| GET | `/api/places/:id` | Single place |
| GET | `/api/categories` | All categories |
| POST | `/api/auth/login` | Login → returns JWT |
| POST | `/api/auth/register` | Register user |
| GET | `/api/auth/me` | Current user (auth) |
| GET | `/api/admin/stats` | Dashboard stats (admin) |
| POST | `/api/admin/places` | Create place (admin) |
| PUT | `/api/admin/places/:id` | Update place (admin) |
| DELETE | `/api/admin/places/:id` | Delete place (admin) |
| POST/PUT/DELETE | `/api/admin/states/:id` | Manage states (admin) |
| POST/PUT/DELETE | `/api/admin/cities/:id` | Manage cities (admin) |
| POST/PUT/DELETE | `/api/admin/categories/:id` | Manage categories (admin) |

---

## Folder Structure

```text
TravelBharat/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── stateController.js
│   │   ├── cityController.js
│   │   ├── categoryController.js
│   │   ├── placeController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── State.js
│   │   ├── City.js
│   │   ├── Category.js
│   │   ├── Place.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── stateRoutes.js
│   │   ├── cityRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── placeRoutes.js
│   │   └── adminRoutes.js
│   ├── index.js
│   ├── seed.js
│   └── .env
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PlaceCard.jsx
    │   │   ├── StateCard.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── Pagination.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── StatesPage.jsx
    │   │   ├── StatePage.jsx
    │   │   ├── PlacesPage.jsx
    │   │   ├── PlaceDetailPage.jsx
    │   │   └── admin/
    │   │       ├── AdminLoginPage.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminPlaces.jsx
    │   │       ├── AdminStates.jsx
    │   │       ├── AdminCities.jsx
    │   │       └── AdminCategories.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── travelService.js
    │   ├── App.jsx
    │   └── main.jsx
    └── .env
```
