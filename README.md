# ShopCraft — PWA E-commerce

A full-stack Progressive Web App built with React, Node.js, Express, and MongoDB.

## Project Structure

```
ecommerce-pwa/
├── client/          # React + Vite + TypeScript + TailwindCSS frontend
└── server/          # Node.js + Express + MongoDB backend
```

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## Setup

### 1. Server

```bash
cd server
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

**.env values:**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce_pwa
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Client

```bash
cd client
npm install
```

---

## Running the App

### Start the server

```bash
cd server
npm run dev
```

Server runs on **http://localhost:5000**

### Start the client

```bash
cd client
npm run dev
```

Client runs on **http://localhost:5173**

---

## Seed the Database

Populate the database with 12 sample products and two test users:

```bash
cd server
npm run seed
```

**Demo credentials:**

| Role  | Email                  | Password      |
|-------|------------------------|---------------|
| User  | user@shopcraft.com     | user123456    |
| Admin | admin@shopcraft.com    | admin123456   |

---

## API Routes

### Auth
| Method | Route               | Access  |
|--------|---------------------|---------|
| POST   | /api/auth/register  | Public  |
| POST   | /api/auth/login     | Public  |
| POST   | /api/auth/logout    | Public  |
| GET    | /api/auth/me        | Private |

### Products
| Method | Route                    | Access  |
|--------|--------------------------|---------|
| GET    | /api/products            | Public  |
| GET    | /api/products/categories | Public  |
| GET    | /api/products/:id        | Public  |
| POST   | /api/products            | Admin   |
| PUT    | /api/products/:id        | Admin   |
| DELETE | /api/products/:id        | Admin   |

### Cart
| Method | Route               | Access  |
|--------|---------------------|---------|
| GET    | /api/cart           | Private |
| POST   | /api/cart           | Private |
| DELETE | /api/cart/clear     | Private |
| DELETE | /api/cart/:productId| Private |

### Orders
| Method | Route            | Access  |
|--------|------------------|---------|
| POST   | /api/orders      | Private |
| GET    | /api/orders/my   | Private |
| GET    | /api/orders/:id  | Private |

---

## PWA Icons

Replace the placeholder files in `client/public/icons/` with real PNG images:

- `icon-192x192.png` — 192×192 px
- `icon-512x512.png` — 512×512 px
- `apple-touch-icon.png` — 180×180 px (in `client/public/`)

You can use a tool like [Favicon.io](https://favicon.io) or [RealFaviconGenerator](https://realfavicongenerator.net) to generate these from the SVG at `client/public/icons/icon.svg`.

PWA features (offline support, install prompt) are active in **production build only**:

```bash
cd client
npm run build
npm run preview
```

---

## Build for Production

```bash
# Server
cd server && npm run build

# Client
cd client && npm run build
```

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite 5
- TailwindCSS 3
- Framer Motion (animations)
- Radix UI primitives
- React Router v6
- Axios
- vite-plugin-pwa (Workbox)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- HTTP-only cookies + Bearer token support
