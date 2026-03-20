# ⛳ GolfGives — Golf Charity Subscription Platform

A full-stack subscription-based web application combining **golf performance tracking**, **monthly prize draws**, and **charitable giving**. Built as a Digital Heroes Full-Stack Development Trainee assignment.

---

## 🔗 Live Demo

| Service | URL |
|---|---|
| **Frontend** | https://digital-heroes-golf.vercel.app |
| **Backend API** | https://digital-heroes-golf.onrender.com |

### Test Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@test.com | your_password |
| **User** | user@test.com | your_password |

> For Stripe test payments use card: `4242 4242 4242 4242` · Expiry: `12/26` · CVC: `123`

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [How the Draw Works](#how-the-draw-works)
- [Prize Pool Logic](#prize-pool-logic)
- [Deployment](#deployment)

---

## 📖 About the Project

GolfGives is a platform where golfers:

1. **Subscribe** to a monthly or yearly plan
2. **Enter their Stableford golf scores** (last 5 scores, rolling)
3. **Participate in monthly draws** — scores act as lottery numbers
4. **Support a charity** of their choice with a portion of their subscription
5. **Win prizes** based on how many scores match the drawn numbers

---

## ✅ Features

### 👤 User Features
- Register, login, and manage profile
- Monthly and yearly subscription via Stripe
- Enter and manage last 5 Stableford golf scores (1–45 range)
- Rolling score system — new score replaces oldest automatically
- Select a charity and set contribution percentage (min 10%)
- View current and past monthly draws
- View winnings and submit proof for prize claims

### 🔧 Admin Features
- Full user management (view, edit, manage subscriptions)
- Configure monthly draw (random or algorithmic)
- Simulate draw before publishing
- Publish draw — winners created automatically
- Manage charity listings (add, edit, delete, feature)
- Verify winner proof submissions (approve/reject)
- Mark prize payouts as completed
- Reports and analytics dashboard

### 🌍 Public Features
- Browse charity listings with search and filter
- View platform concept and draw mechanics
- View featured charities on homepage

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **Payments** | Stripe (subscriptions + webhooks) |
| **Email** | Nodemailer (Gmail SMTP) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
golf-charity-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── scoreController.js
│   │   │   ├── drawController.js
│   │   │   ├── charityController.js
│   │   │   ├── subscriptionController.js
│   │   │   ├── winnerController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── adminMiddleware.js
│   │   │   └── subscriptionMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Score.js
│   │   │   ├── Draw.js
│   │   │   ├── Charity.js
│   │   │   ├── Subscription.js
│   │   │   └── Winner.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── scoreRoutes.js
│   │   │   ├── drawRoutes.js
│   │   │   ├── charityRoutes.js
│   │   │   ├── subscriptionRoutes.js
│   │   │   ├── winnerRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── utils/
│   │   │   ├── drawEngine.js
│   │   │   ├── prizeCalculator.js
│   │   │   └── emailService.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Loader.jsx
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── dashboard/
    │   │   │   ├── ScoreEntry.jsx
    │   │   │   ├── ScoreList.jsx
    │   │   │   ├── CharitySelector.jsx
    │   │   │   ├── DrawParticipation.jsx
    │   │   │   └── WinningsOverview.jsx
    │   │   └── admin/
    │   │       ├── AdminReports.jsx
    │   │       ├── UserTable.jsx
    │   │       ├── DrawManager.jsx
    │   │       ├── CharityManager.jsx
    │   │       └── WinnerVerification.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useScores.js
    │   │   └── useCharities.js
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Charities.jsx
    │   │   ├── Subscribe.jsx
    │   │   └── admin/
    │   │       └── AdminDashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vercel.json
    ├── .env
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free)
- Stripe account (free test mode)
- Gmail account with App Password enabled

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/golf-charity-platform.git
cd golf-charity-platform
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Set up Environment Variables

Create `backend/.env` (see [Environment Variables](#environment-variables) section below)

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Stripe Webhook Listener:**
```bash
cd backend
.\stripe listen --forward-to localhost:5000/api/subscriptions/webhook
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/golf-charity?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

### How to get each value:

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any random string you choose |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Run `stripe listen` and copy the `whsec_` value |
| `STRIPE_MONTHLY_PRICE_ID` | Stripe Dashboard → Product Catalog → Monthly product |
| `STRIPE_YEARLY_PRICE_ID` | Stripe Dashboard → Product Catalog → Yearly product |
| `EMAIL_PASS` | Google Account → Security → App Passwords |

---

## 🛣 API Routes

### Auth
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user (protected)
PUT    /api/auth/update-profile    Update profile (protected)
```

### Scores
```
GET    /api/scores                 Get my scores (subscriber only)
POST   /api/scores                 Add a score (subscriber only)
PUT    /api/scores/:scoreId        Edit a score (subscriber only)
DELETE /api/scores/:scoreId        Delete a score (subscriber only)
```

### Draws
```
GET    /api/draws                  Get all draws
GET    /api/draws/current          Get current month draw
POST   /api/draws/configure        Configure draw (admin only)
POST   /api/draws/:id/simulate     Simulate draw (admin only)
POST   /api/draws/:id/publish      Publish draw (admin only)
```

### Charities
```
GET    /api/charities              Get all charities (public)
GET    /api/charities/featured     Get featured charities (public)
GET    /api/charities/:id          Get single charity (public)
POST   /api/charities              Create charity (admin only)
PUT    /api/charities/:id          Update charity (admin only)
DELETE /api/charities/:id          Delete charity (admin only)
```

### Subscriptions
```
POST   /api/subscriptions/create-checkout    Create Stripe checkout
POST   /api/subscriptions/webhook            Stripe webhook handler
GET    /api/subscriptions/my-subscription    Get my subscription
POST   /api/subscriptions/cancel             Cancel subscription
```

### Winners
```
GET    /api/winners/my-winnings        Get my winnings
POST   /api/winners/:id/upload-proof   Upload proof
GET    /api/winners                    Get all winners (admin only)
PUT    /api/winners/:id/verify         Approve/reject winner (admin only)
PUT    /api/winners/:id/mark-paid      Mark as paid (admin only)
```

### Admin
```
GET    /api/admin/users                    Get all users
PUT    /api/admin/users/:id                Edit user
PUT    /api/admin/users/:id/scores         Edit user scores
PUT    /api/admin/users/:id/subscription   Update subscription status
GET    /api/admin/reports                  Get platform reports
```

---

## 🎲 How the Draw Works

Each month the admin runs a draw using one of two modes:

### Random Mode
5 numbers are picked completely at random from the Stableford range (1–45).

### Algorithmic Mode
Numbers are weighted by frequency — scores that appear most often across all users have a higher probability of being drawn.

### Matching
The system compares each active subscriber's 5 scores against the 5 drawn numbers:

```
User scores:    32, 28, 35, 30, 25
Drawn numbers:  25, 28, 30, 35, 40

Matches:        25 ✅  28 ✅  30 ✅  35 ✅  = 4-match winner!
```

---

## 💰 Prize Pool Logic

A portion of each subscription contributes to the prize pool.

| Match | Pool Share | Rollover |
|---|---|---|
| 5 Numbers | 40% | ✅ Yes (Jackpot) |
| 4 Numbers | 35% | ❌ No |
| 3 Numbers | 25% | ❌ No |

- If multiple users match the same tier, the prize is **split equally**
- If nobody matches 5 numbers, the **jackpot rolls over** to next month
- Charity contribution is a **minimum of 10%** of each subscription

---

## 🌐 Deployment

### Frontend — Vercel

1. Push `frontend/` folder to GitHub
2. Go to https://vercel.com → New Project → Import repo
3. Set Root Directory to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api
   ```
5. Deploy

### Backend — Render

1. Push `backend/` folder to GitHub
2. Go to https://render.com → New Web Service → Import repo
3. Set Root Directory to `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all environment variables from `.env`
7. Deploy

### After Deploying Both

Update `CLIENT_URL` on Render to your Vercel frontend URL.

---

## 📋 Testing Checklist

- [x] User signup and login
- [x] Subscription flow (monthly and yearly)
- [x] Score entry — 5-score rolling logic
- [x] Draw system — configure, simulate, publish
- [x] Charity selection and contribution calculation
- [x] Winner verification flow and payout tracking
- [x] User Dashboard — all modules functional
- [x] Admin Panel — full control and usability
- [x] Data accuracy across all modules
- [x] Responsive design on mobile and desktop
- [x] Error handling and edge cases

---

## 👨‍💻 Author

Built for the **Digital Heroes Full-Stack Development Trainee Selection Process**

**Digital Heroes** — Premium Full-Stack Development & Digital Marketing Agency  
Website: https://digitalheroes.co.in

---

## 📄 License

This project was built as part of a trainee selection assignment for Digital Heroes.