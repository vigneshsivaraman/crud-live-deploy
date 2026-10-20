# StockFlow — Fullstack CRUD Application (React + NestJS + PostgreSQL)

A complete, production-ready fullstack CRUD application featuring **React** (Vite + Tailwind CSS), **NestJS** (with TypeORM), and a dedicated **PostgreSQL** database.

---

## 🌟 Features

- **Full CRUD Capabilities**:
  - **Create**: Add new products with validation (Title, Category, Price, Stock, Description, SKU).
  - **Read**: Live catalog with instant keyword search, category filtering, stock status filtering, and sorting (name, price, stock, date).
  - **Update**: Edit product details via interactive modal; quick (+ / -) inline stock adjustments with automatic status recalculation (`In Stock`, `Low Stock`, `Out of Stock`).
  - **Delete**: Remove items with confirmation modal to prevent accidental deletion.
- **Analytics & Dashboard Overview**:
  - Total items count
  - Real-time inventory valuation (`sum(price * stock)`)
  - Low stock alerts (<= 10 units)
  - Out of stock warnings (0 units)
  - Category count
- **Dual View Modes**: Switch between **Modern Grid Cards** and **High-Density Table View**.
- **Sample Data Seeder**: Pre-populates the PostgreSQL database with realistic demo catalog data on launch or via one-click "Seed Demo Data" button.
- **Interactive Feedback**: Floating toast notifications for real-time operation confirmation and error reporting.

---

## 🏗 Architecture & Stack

```
[ Frontend: React 18 + Vite + TailwindCSS ]
                     │
              HTTP / REST JSON
                     │
 [ Backend: NestJS 10 + TypeORM + class-validator ]
                     │
             PostgreSQL Driver
                     │
  [ Database: PostgreSQL 17 (crud_db on port 5434) ]
```

### Frontend (`/frontend`)
- **React 18** with **TypeScript** and **Vite**
- **Tailwind CSS** for modern styling
- **Lucide React** icons
- **Axios** for API requests

### Backend (`/backend`)
- **NestJS 10** with **TypeScript**
- **TypeORM** for object-relational mapping
- **PostgreSQL (`pg`)** driver
- **class-validator** & **class-transformer** for DTO validation
- Auto-sync schema and automatic seed on startup

### Database
- **PostgreSQL 17**
- Configured on port `5434` with UNIX socket in `/tmp`
- Database: `crud_db`

---

## 🚀 Quick Start (One Command)

Start PostgreSQL, the NestJS API, and the React Frontend all together:

```bash
./start.sh
```

Or using npm:

```bash
npm start
```

### URLs
- **Frontend UI**: [http://localhost:5174](http://localhost:5174)
- **Backend API**: [http://localhost:3001/api/products](http://localhost:3001/api/products)
- **API Stats**: [http://localhost:3001/api/products/stats](http://localhost:3001/api/products/stats)

---

## 🛠 Running Services Individually

### 1. Database
```bash
# Start PostgreSQL server on port 5434
./scripts/start-db.sh

# Stop PostgreSQL server
./scripts/stop-db.sh
```

### 2. Backend (NestJS)
```bash
cd backend
npm run start:dev
```
Runs on `http://localhost:3001`.

### 3. Frontend (React)
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5174`.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get products with search, category, status, sortBy, order filters |
| `GET` | `/api/products/stats` | Get dashboard overview statistics |
| `POST` | `/api/products/seed` | Seed or re-seed sample demo products |
| `GET` | `/api/products/:id` | Get single product by ID |
| `POST` | `/api/products` | Create a new product |
| `PATCH` | `/api/products/:id` | Update product details or stock |
| `DELETE` | `/api/products/:id` | Delete product by ID |

---

## 📂 Project Structure

```
crud live app/
├── backend/
│   ├── pgdata/               # Dedicated PostgreSQL cluster data
│   ├── src/
│   │   ├── products/
│   │   │   ├── dto/
│   │   │   │   ├── create-product.dto.ts
│   │   │   │   └── update-product.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── product.entity.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── products.module.ts
│   │   │   └── products.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── StatsOverview.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   ├── DeleteModal.tsx
│   │   │   └── Toast.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── product.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── scripts/
│   ├── start-db.sh           # Starts/initializes PostgreSQL
│   └── stop-db.sh            # Stops PostgreSQL
├── start.sh                  # One-click startup script
├── package.json
└── README.md
```
