# Crypify — Crypto Dashboard

Crypify – A Full-Stack Crypto Dashboard (Portfolio Edition)

Crypify is a full-stack cryptocurrency dashboard project built with **Go** (Gin) backend and **Next.js** frontend. It provides live crypto market data, charts, and utilities like coin comparison and conversion using the **CoinGecko API**.

---

## 🌐 Live Features

- 🌍 Real-time crypto price updates
- 📈 Interactive sparkline + historical charts
- 🔄 Coin compare functionality
- 💹 USD converter for each coin
- 🌗 Light/Dark theme toggle
- 🚀 Animated splash screen on landing
- 📱 Responsive design

---

## 🚀 DEMO
Demo at : https://crypify-dashboard-frontend.onrender.com/markets

## Image Screenshots

![alt text](/doc/image.png)

![alt text](/doc/image-7.png)

![alt text](/doc/image-6.png)

![alt text](/doc/image-3.png)

## 📁 Project Structure

### 🔧 Backend (Go)

Located in: `./backend/` or `./providers/` package

**Files / Exports**
- `NewCoingeckoProvider()` – initializes the provider with env vars
- `Price(symbol)` – fetches current price
- `History(symbol, asset, rangeQ)` – returns time series candles
- `HistoryRange(symbol, from, to)` – precise range data
- `AllHistory(rangeQ)` – fetch history for all coins
- `AllCoins()` – fetch top coins with sparkline + change %

### COINSGECOKO API DOC
- **Coins Gecko Documentation & API TOKEN from: https://docs.coingecko.com/**



**Environment Variables Samples**
```
Backend

----------------------------------------------------
PORT=xxxx
ORIGIN=xxxx
COINGECKO_API_BASE=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=xxxxx
COINGECKO_VS_CURRENCY=xxx
API_KEY=xxxxxx

----------------------------------------------------

Frontend

----------------------------------------------------

BACKEND_URL=xxxxx
API_KEY=xxxxx

----------------------------------------------------

```

---



### 🎨 Frontend (Next.js + Tailwind)

Located in: `./frontend/app/`

**Core Pages**
- `/` → Splash Landing (with loading animation)
- `/markets` → Main market dashboard

**Key Components**
- `Header` – Logo, theme toggle, time
- `Logo.tsx` – Reusable logo component for header + favicon
- `CoinsTable` – Displays top coins w/ filters
- `PriceChart`, `CompareChart` – Detailed Recharts-based graphs
- `CoinDetails` – Stats, metrics
- `CoinsUsdConverter` – Converts selected coin to USD

**Styling**
- `themeToggle.tsx` – switch between light/dark mode
- Tailwind CSS with custom `bg`, `card`, `line` variables

**Utils**
- `formatCurrencySmart()` – Auto-compacts large currency (e.g. $1.2M)
- `tsToShort()` – Short date formatter (e.g. Aug 27)

---

## 🔧 Dev Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```


### Backend

```bash
cd backend
go mod tidy
go run main.go
```

---



## 🖼 Meta, Logo, and SEO

- Used `Logo.tsx` as app logo and favicon across pages
- Each route uses per-page `metadata` inside `layout.tsx` (due to `"use client"` restrictions)
- Splash page (`app/page.tsx`) has custom dark/light background class

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```

- Backend → `http://localhost:8080`
- Frontend → `http://localhost:3000`


---

## 📚 Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Recharts, SWR
- **Backend:** Go, Gin, CoinGecko API
- **State/Data:** SWR, dynamic selection
- **Deployment:** Dev setup for localhost

---

## ✨ Author

Built with ❤️ by [Phumiapiluk Pimsen]

---

## 📄 License

MIT (or specify)