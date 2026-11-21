# Next Level Mart

A starter monorepo for a grocery marketplace with an Android customer app, a Node.js API, and a web admin dashboard.

## Project structure

- `android/` — Native Android app using Kotlin and Jetpack Compose.
- `backend/` — Express API with sample products and in-memory order creation.
- `admin/` — React + Vite admin dashboard.

## Run the API

```bash
cd backend
npm install
npm run dev
```

API listens on `http://localhost:4000`. `GET /api/health`, `GET /api/products`, `GET /api/orders`; `POST /api/orders` creates an in-memory order. Data resets when the server restarts. This is a development starter, not a production deployment.

## Run the admin dashboard

```bash
cd admin
npm install
npm run dev
```

The dashboard uses `VITE_API_URL` (defaults to `http://localhost:4000`). Set it in `admin/.env` if needed. If the API is unavailable, the dashboard displays demo metrics.

## Run the Android app

Open the `android/` directory in Android Studio and run the `app` configuration. The app uses sample products for the initial UI. For an emulator, the API base URL should be `http://10.0.2.2:4000`; for a physical device, use your computer's LAN IP and ensure both devices are on the same network. Update `API_BASE_URL` in `android/app/src/main/java/com/nextlevelmart/app/MainActivity.kt`.

## Important before launch

This is an initial MVP scaffold. Before real customer use, add persistent database storage, authentication/OTP provider, secure admin authorization, payment gateway integration, delivery and location workflows, privacy policy, and production HTTPS. Never store payment credentials or secrets in the client app.
