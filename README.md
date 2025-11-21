# Watcher - Parental Control & Monitoring System

**Watcher** is a full-stack web application designed to provide parents with monitoring and control capabilities over their children's devices. It features a modern marketing frontend, a secure user dashboard, subscription management via Stripe, and a robust backend API for managing users, orders, and authentication.

## 📚 Table of Contents

* [Tech Stack](https://www.google.com/search?q=%23-tech-stack)
* [Project Architecture](https://www.google.com/search?q=%23-project-architecture)
* [Detailed File Structure & Logic](https://www.google.com/search?q=%23-detailed-file-structure--logic)

  * [Backend (Server-Side)](https://www.google.com/search?q=%231-backend-server-side)
  * [Frontend (Client-Side)](https://www.google.com/search?q=%232-frontend-client-side)
* [Installation & Setup](https://www.google.com/search?q=%23-installation--setup)
* [Environment Variables](https://www.google.com/search?q=%23-environment-variables)
* [API Documentation](https://www.google.com/search?q=%23-api-documentation)

---

## 🛠 Tech Stack

### **Frontend**

* **Framework:** React (v19) with Vite
* **Styling:** Tailwind CSS (v3.4), CSS Modules
* **Animations:** Framer Motion, Lottie React
* **Routing:** React Router DOM (v7)
* **State Management:** React Context API (`useContext`)
* **Payments:** Stripe Elements (`@stripe/react-stripe-js`)
* **Icons:** Lucide React, React Icons
* **Scrolling:** Lenis (Smooth Scroll)

### **Backend**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT) & BcryptJS
* **Payments:** Stripe SDK
* **Security:** CORS, Dotenv

---

## 🏗 Project Architecture

The application follows the **MERN** stack architecture (MongoDB, Express, React, Node.js).

1. **Client:** The React app serves the UI. It consumes the backend API via `fetch` calls within Contexts and Pages. It handles routing, protected routes (Dashboards), and Stripe Payment integration.
2. **Server:** The Express server acts as a REST API. It connects to MongoDB to store User and Order data. It validates JWT tokens via middleware before allowing access to private routes.
3. **Database:** MongoDB stores `Users` (with admin flags) and `Orders` (transaction history).

---

## 📂 Detailed File Structure & Logic

### 1. Backend (Server-Side)

Located in the `/Backend` folder.

#### **Configuration**

* **`config/db.js`**: Establishes an asynchronous connection to MongoDB using Mongoose. It utilizes the `MONGO_URI` environment variable.
* **`package.json`**: Lists server dependencies (`express`, `mongoose`, `stripe`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`).

#### **Models (Database Schemas)**

* **`models/User.js`**: Defines the User schema (name, email, password, isAdmin, avatar).

  * *Logic:* Includes a `pre('save')` middleware to automatically hash passwords using `bcrypt` before storing them. Includes a `matchPassword` method for login verification.
* **`models/Order.js`**: Defines the Order schema.

  * *Logic:* Links to the `User` model via ObjectId. Stores line items, payment method, tax, shipping status, and payment status (`isPaid`).

#### **Controllers (Business Logic)**

* **`controllers/userController.js`**:

  * `registerUser`: Checks if a user exists; if not, creates a new user and returns a JWT.
  * `authUser`: Verifies email and password; returns user profile and JWT if successful.
  * *Helper:* `generateToken` creates a JWT valid for 30 days.
* **`controllers/orderController.js`**:

  * `addOrderItems`: Saves a new order to the database after payment success.
  * `getMyOrders`: Fetches orders belonging *only* to the logged-in user.
  * `getOrders`: Admin-only function to fetch *all* orders in the system.
* **`controllers/paymentController.js`**:

  * `createPaymentIntent`: interacting with the Stripe API. It calculates the amount (in the smallest currency unit) and returns a `clientSecret` required by the frontend to finalize the transaction.

#### **Routes (API Endpoints)**

* **`routes/userRoutes.js`**: Maps POST `/` to register and POST `/login` to auth controllers.
* **`routes/orderRoutes.js`**: Maps order operations. Uses `protect` middleware for user routes and `admin` middleware for the global get route.
* **`routes/paymentRoutes.js`**: Maps the payment intent creation to the controller, protected by auth middleware.

#### **Middleware**

* **`middleware/authMiddleware.js`**:

  * `protect`: Intercepts the request, reads the `Authorization: Bearer <token>` header, verifies the JWT, and attaches the `user` object to `req`.
  * `admin`: Checks if `req.user.isAdmin` is true. If not, blocks access.

#### **Entry Point**

* **`server.js`**: Initializes the Express app, applies CORS and JSON parsing, connects to the DB, mounts the routes (`/api/users`, `/api/orders`, `/api/payment`), and starts the server.

---

### 2. Frontend (Client-Side)

Located in the `/Frontend` folder.

#### **Root Configuration**

* **`vite.config.js`**: Configures Vite. Includes a proxy setup (`/api` -> `localhost:5000`) to avoid CORS issues during development. Configures image optimization.
* **`tailwind.config.js`**: Customizes the design system, adding specific colors (e.g., `#BB86FC`, `#0C0E12`) and fonts (Poppins).
* **`index.html`**: The HTML shell. Loads the main script and Google Fonts.

#### **Source (`/src`)**

* **`main.jsx`**: The React entry point. Wraps the `App` in `BrowserRouter`.
* **`App.jsx`**: The root component.

  * *Logic:* Sets up the `Lenis` smooth scroll. Wraps the app in `AuthProvider` and `CartProvider`. Defines the application routes (`/`, `/login`, `/dashboard`, `/cart`, etc.). Manages the global Download Modal state.
* **`AppRoutes.tsx`**: Alternative routing definition file (TypeScript), mapping paths to components like `PrivacyPolicyPage` and `DownloadModal`.

#### **Context (Global State)**n

* **`context/AuthContext.jsx`**: Manages user login state.

  * *Logic:* Checks `localStorage` on load. Provides `login`, `register`, and `logout` functions that interact with the backend API.
* **`context/CartContext.jsx`**: Manages the shopping cart.

  * *Logic:* Persists cart to `localStorage`. Enforces a limit of 1 subscription plan per cart.

#### **Pages**

* **`pages/Login.jsx`**: Handles both Login and Registration. Toggles between modes. Redirects based on success/failure.
* **`pages/Dashboard.jsx`**: Protected user area.

  * *Logic:* Fetches user's specific orders from the API. Determines "User Status" (e.g., "Gold Plan") based on purchase history. Allows downloading guides.
* **`pages/AdminDashboard.jsx`**: Protected admin area.

  * *Logic:* Fetches *all* orders. Calculates total revenue, total orders, and unique customers. Displays a transaction table.
* **`pages/Cart.jsx`**: Displays selected plan. Allows removal of items. Calculates totals.
* **`pages/Payment.jsx`**: The Checkout page.

  * *Logic:* Initializes the Stripe Payment Element. Calls the backend to generate a `clientSecret`.

#### **Components (UI Blocks)**

* **`Navbar.jsx`**: Responsive navigation. Adapts based on login state (shows Dashboard/Cart if logged in). Handles mobile menu animation.
* **`Hero.jsx`**: Landing page banner with Framer Motion entrance animations.
* **`Features.jsx`**: Interactive tabbed interface switching between feature categories (Device, Comm, Files, etc.) with changing phone mockups.
* **`Pricing.jsx`**: Displays subscription plans. Allows adding plans to the global Cart context.
* **`PreFooterCTA.jsx`**: A glassmorphic call-to-action section before the footer.
* **`CheckoutForm.jsx`**: The specific Stripe form component.

  * *Logic:* Confirms payment with Stripe. If successful, sends a POST request to `/api/orders` to save the record in the database.
* **`PrivacyPolicyPage.jsx`**: Renders distinct policy tabs (Privacy, EULA, Payment, Security) with detailed legal text.
* **`DownloadModal.jsx`**: Pop-up for downloading the Parent App (Play Store link) or Child App (APK download).

#### **Assets**

* **`src/assets/`**: Contains WebP/PNG images for mockups (`chat-mockup`, `location-mockup`, `Hero.webp`) and icons (`eyes.webp`).

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js (v16+)
* MongoDB (Local or Atlas URI)
* Stripe Account (for API keys)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/one-store.git
cd one-store
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `/Backend` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Start the server:

```bash
npm run dev  # Uses nodemon
```

### 3. Frontend Setup

Open a new terminal.

```bash
cd Frontend
npm install
```

Create a `.env` file in `/Frontend` with the following:

```env
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

Start the client:

```bash
npm run dev
```

Access the app at `http://localhost:5173`.

---

## 📡 API Documentation

| Method   | Endpoint                             | Access  | Description                         |
| :------- | :----------------------------------- | :------ | :---------------------------------- |
| **POST** | `/api/users`                         | Public  | Register a new user.                |
| **POST** | `/api/users/login`                   | Public  | Authenticate user & get token.      |
| **GET**  | `/api/orders`                        | Admin   | Get all orders (Revenue stats).     |
| **POST** | `/api/orders`                        | Private | Create a new order (after payment). |
| **GET**  | `/api/orders/myorders`               | Private | Get logged-in user's order history. |
| **POST** | `/api/payment/create-payment-intent` | Private | Initialize Stripe payment intent.   |

---

## 📝 License

This project is proprietary software. Unauthorized copying or distribution is strictly prohibited.

**Disclaimer:** This application is intended for legal parental monitoring usage only. Users must comply with local laws regarding privacy and surveillance.


# Codebase Connection Map & Architecture Overview

This document explains how the Watcher (One-Store) codebase is structured, how different modules communicate, and how data flows between the Frontend and Backend.

## 1. Full-Stack Bridge (Frontend ↔ Backend)

### Proxy Configuration

**Frontend/vite.config.js**
Requests starting with `/api` are forwarded to `http://localhost:5000`, allowing the React app to communicate with the Express backend during development.

### API Consumption Points

#### Authentication

* **Frontend/src/context/AuthContext.jsx**

  * `POST /api/users`
  * `POST /api/users/login`

#### Payments

* **Frontend/src/pages/Payment.jsx**

  * `POST /api/payment/create-payment-intent`

#### Order Handling

* **Frontend/src/components/CheckoutForm.jsx**

  * `POST /api/orders`

#### User-Specific Data

* **Frontend/src/pages/Dashboard.jsx**

  * `GET /api/orders/myorders`

#### Admin Data

* **Frontend/src/pages/AdminDashboard.jsx**

  * `GET /api/orders`

---

## 2. Backend Interdependencies

The backend follows a predictable flow:
**Routes → Middleware → Controllers → Models**

### Entry Point

**Backend/server.js**

* Connects to MongoDB (`config/db.js`)
* Mounts:

  * `userRoutes.js`
  * `orderRoutes.js`
  * `paymentRoutes.js`

### Flow Breakdown

#### User Flow

1. Request reaches `routes/userRoutes.js`
2. Delegated to `controllers/userController.js`
3. Controller interacts with `models/User.js`

#### Order Flow

1. Request reaches `routes/orderRoutes.js`
2. `authMiddleware.js` verifies JWT (`protect`) or admin status (`admin`)
3. Delegated to `controllers/orderController.js`
4. Controller interacts with `models/Order.js`

#### Payment Flow

1. Request reaches `routes/paymentRoutes.js`
2. Delegated to `controllers/paymentController.js`
3. Controller calls Stripe through the `stripe` package

---

## 3. Frontend Interdependencies

The frontend is composed of components wrapped with context providers.

### Initialization

* **src/main.jsx**
  Renders `<App />` inside `<BrowserRouter />`.

* **src/App.jsx**

  * Wraps the app in AuthContext and CartContext
  * Defines all routes
  * Imports persistent UI such as Navbar

### Component Interaction

#### Shopping & Purchase Flow

* **Cart.jsx**
  Reads from CartContext
* **Pricing.jsx**
  Adds items to the cart
* **Payment.jsx**
  Fetches clientSecret
* **CheckoutForm.jsx**
  Processes payment with Stripe

#### App Download Flow

* **DownloadModal.jsx**
  Triggered by Hero or Navbar

---

## 4. Key Workflows

### Authentication Workflow

1. User submits form in `Login.jsx`
2. AuthContext sends POST request
3. Backend validates through `userController.js` using `User.js` `matchPassword()`
4. Backend sends JWT
5. Frontend stores token and redirects to Dashboard

### Purchase Workflow

1. User chooses a plan in Pricing.jsx
2. Plan stored via CartContext
3. User proceeds to Payment.jsx
4. Backend generates Stripe `clientSecret`
5. CheckoutForm.jsx confirms payment
6. On success, saves order via `POST /api/orders`
7. Backend writes to `Order.js`
8. User gains access to downloads and order history
