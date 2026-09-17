# BLU CORE Backend API

Production-ready backend for **BLU CORE CNC Cutting & Wall Panels**, built with **Node.js**, **Express.js**, and **Firebase Admin SDK (Firestore & Storage)**.

---

## 🚀 Features

- **Database**: Cloud Firestore for quotes, contacts, gallery, projects, services, materials, branches, and admin accounts.
- **File Storage**: Firebase Storage for uploaded customer design references and gallery images (with local development fallback).
- **Authentication**: JWT-based admin authorization with bcrypt password hashing.
- **Quote Processing**: Multipart/JSON support, validation, rate limiting, and automated email notifications.
- **Security**: Helmet, configurable CORS, express-rate-limit, and sanitized inputs.
- **Resilience**: Offline/mock fallback mode allows development and testing even before live Firebase credentials are provided.

---

## 📁 Project Structure

```text
backend/
├── config/
│   └── firebase.js              # Firebase Admin SDK singleton with fallback
├── controllers/
│   ├── quoteController.js       # Quotes public create & admin CRUD
│   ├── contactController.js     # Contact submissions & management
│   ├── galleryController.js     # Gallery items & uploads
│   ├── projectController.js     # Project applications
│   ├── serviceController.js     # Craft services
│   ├── materialController.js    # Materials list
│   ├── branchController.js      # Branch locations
│   └── adminController.js       # Admin login & dashboard stats
├── middleware/
│   ├── authMiddleware.js        # JWT bearer token verification
│   ├── errorHandler.js          # Centralized error handler & 404 router
│   ├── uploadMiddleware.js      # Multer memory storage & MIME filtering
│   ├── validationMiddleware.js  # Input validation rules
│   └── rateLimitMiddleware.js   # Rate limiters
├── models/
│   ├── quoteModel.js
│   ├── contactModel.js
│   ├── galleryModel.js
│   ├── projectModel.js
│   ├── serviceModel.js
│   ├── materialModel.js
│   ├── branchModel.js
│   └── adminModel.js
├── routes/
│   ├── quoteRoutes.js           # /api/quotes, /api/quote, /api/admin/quotes
│   ├── contactRoutes.js         # /api/contact, /api/admin/contacts
│   ├── galleryRoutes.js         # /api/gallery
│   ├── projectRoutes.js         # /api/projects
│   ├── serviceRoutes.js         # /api/services
│   ├── materialRoutes.js        # /api/materials
│   ├── branchRoutes.js          # /api/branches
│   ├── adminRoutes.js           # /api/admin/login, /api/admin/dashboard
│   └── healthRoutes.js          # /api/health
├── services/
│   ├── firestoreService.js      # Data access layer for Firestore
│   ├── storageService.js        # Firebase Storage file upload & URLs
│   └── emailService.js          # Transactional email notification service
├── utils/
│   ├── constants.js
│   ├── validators.js
│   └── response.js
├── scripts/
│   ├── createAdmin.js           # CLI script to create initial admin account
│   └── seedData.js              # CLI script to populate initial content
├── uploads/                     # Local fallback upload directory
├── .env.example
├── package.json
└── server.js
```

---

## ⚙️ Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Review and adjust variables in `.env`:
- `PORT`: Default is `5000`
- `FRONTEND_URL`: Allowed origins for CORS (e.g. `http://localhost:3000,http://localhost:5173`)
- `JWT_SECRET`: Secret key for signing admin authentication tokens

### 3. Create First Admin Account

```bash
npm run create-admin
```

This will initialize an admin account (default: `admin@blucoredesign.com` / `Admin@123456`). You can customize via `ADMIN_INIT_EMAIL` and `ADMIN_INIT_PASSWORD` in `.env`.

### 4. Optional: Seed Initial Data

```bash
npm run seed
```

Seeds the 7 services, 6 materials, and 4 branches into Firestore.

### 5. Start Development Server

```bash
npm run dev
```

Or for production:

```bash
npm start
```

---

## 🔥 Firebase Setup Guide

Follow these 5 steps to connect your live Firebase project:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and enter `blucore-interior` (or your preferred name).

### Step 2: Enable Firestore Database & Storage
1. In the console, navigate to **Build > Firestore Database** and click **Create database** (choose production or test mode in a location closest to your users, e.g. `asia-south1`).
2. Navigate to **Build > Storage** and click **Get started** to enable Cloud Storage.

### Step 3: Create a Service Account
1. In Firebase Console, go to **Project Settings (gear icon) > Service accounts**.
2. Click **Generate new private key**.
3. A JSON file will download to your computer.

### Step 4: Configure Backend Environment Variables
In `backend/.env`, paste the values from your downloaded JSON:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

*Alternatively, place the downloaded file at `backend/config/serviceAccountKey.json` and set:*
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
```

### Step 5: Start the Backend
```bash
npm run dev
```

The console will confirm:
`[Firebase] Initialized Admin SDK with project: your-project-id`

---

## 📡 API Reference

### Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/quotes` | Submit quote request (multipart with file or JSON) |
| `POST` | `/api/quote` | Alias for `/api/quotes` |
| `POST` | `/api/contact` | Submit contact inquiry |
| `GET` | `/api/services` | List all active craft services |
| `GET` | `/api/materials` | List all materials |
| `GET` | `/api/gallery` | List gallery items (supports `?category=WALL PANELS`) |
| `GET` | `/api/projects` | List projects by category |
| `GET` | `/api/branches` | List all 4 branches |

### Admin Endpoints (Require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Login with email & password, receive JWT |
| `GET` | `/api/admin/dashboard` | Dashboard metrics (total quotes, new, in-progress, etc.) |
| `GET` | `/api/admin/quotes` | Paginated quotes with status filter & search |
| `GET` | `/api/admin/quotes/:id` | Detailed quote record with reference file URL |
| `PATCH` | `/api/admin/quotes/:id` | Update status (`new`, `contacted`, `in-progress`, `completed`, `cancelled`) |
| `DELETE`| `/api/admin/quotes/:id` | Delete quote |
| `GET` | `/api/admin/contacts` | Paginated contact inquiries |
| `POST` | `/api/gallery` | Add gallery item (multipart with `image`) |
| `PATCH`| `/api/gallery/:id` | Edit gallery item |
| `DELETE`| `/api/gallery/:id` | Remove gallery item |

---

## 🔗 Connecting with React Frontend

In the root React application, update `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend `QuoteForm` will automatically submit quote requests and design files to the Express + Firebase backend!
