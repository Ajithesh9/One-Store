# Watcher (One-Store) - Parental Control & Monitoring System

**Watcher** is a full-stack MERN application designed for parental monitoring. It features a responsive marketing frontend, a secure dashboard for users and admins, and a backend API handling authentication, orders, and Stripe payments.

---

## 📚 Table of Contents
1. [Tech Stack](#1-tech-stack)
2. [Project Architecture](#2-project-architecture)
3. [File Structure & Logic](#3-file-structure--logic)
4. [Installation & Setup](#4-installation--setup)
   - [Step 1: Clone Repository](#step-1-clone-repository)
   - [Step 2: Backend Setup](#step-2-backend-setup)
   - [Step 3: Frontend Setup](#step-3-frontend-setup)
5. [API Documentation](#5-api-documentation)

---

## 1. Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Stripe Elements, React Router v7.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication.
- **Tools:** ESLint, PostCSS, Nodemon.

---

## 2. Project Architecture

- **Client:** Single Page Application (SPA) communicating via REST API. Uses `http-proxy` in development to forward `/api` requests.
- **Server:** Stateless REST API. Protected routes use Bearer Token (JWT) authentication.
- **Database:** MongoDB stores Users (with role-based access) and Orders.

---

## 3. File Structure & Logic

### Backend (`/Backend`)
- **`server.js`**: Entry point. Connects to DB, applies CORS, and mounts routes.
- **`config/db.js`**: MongoDB connection logic.
- **`middleware/authMiddleware.js`**: Validates JWTs (`protect`) and Admin privileges (`admin`).
- **`models/`**:
  - `User.js`: User schema with password hashing middleware.
  - `Order.js`: Order schema linking products to users.
- **`controllers/`**:
  - `userController.js`: Registration & Login logic.
  - `orderController.js`: Order creation and history retrieval.
  - `paymentController.js`: Stripe Payment Intent generation.
- **`routes/`**: API route definitions.

### Frontend (`/Frontend`)
- **`vite.config.js`**: Vite configuration with API proxy.
- **`src/App.jsx`**: Main app component handling Routes and Context providers.
- **`src/context/`**:
  - `AuthContext.jsx`: Handles Login/Register state.
  - `CartContext.jsx`: Handles shopping cart state.
- **`src/pages/`**:
  - `Login.jsx`: Authentication page.
  - `Dashboard.jsx`: User dashboard showing order history.
  - `AdminDashboard.jsx`: Admin view of all system orders.
  - `Payment.jsx`: Stripe payment page.
- **`src/components/`**: Reusable UI components (Navbar, Pricing, CheckoutForm).

---

## 4. Installation & Setup

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd watcher-one-store