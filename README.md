# 🏠 Smart Housing Platform

A full-stack rental & roommate matching web application built with React, Node.js, and real-time chat.

---

## ✅ Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** v8+

That's it — no database installation needed! The backend uses a flat-file JSON store.

---

## 🚀 Quick Start (3 steps)

### 1. Install & seed the backend
```bash
cd backend
npm install
npm run seed
```

### 2. Start the backend server
```bash
npm start
# Backend running at http://localhost:5000
```

### 3. Install & start the frontend (new terminal)
```bash
cd ../frontend
npm install
npm run dev
# Frontend at http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🔑 Demo Accounts

All accounts use password: **`password123`**

| Name | Email | Role |
|------|-------|------|
| Raj Kumar | raj@example.com | Property Owner |
| Priya Singh | priya@example.com | Property Owner |
| Arjun Mehta | arjun@example.com | Tenant |
| Sana Shaikh | sana@example.com | Tenant |
| Vikram Nair | vikram@example.com | Tenant |

> 💡 **Tip:** Use the "Quick demo login" buttons on the login page.

---

## 📋 Features

| Feature | Status |
|---------|--------|
| JWT Authentication | ✅ |
| Property Listings (CRUD) | ✅ |
| Search & Filter | ✅ |
| Roommate Compatibility Matching | ✅ |
| Real-time Chat (Socket.io) | ✅ |
| Reviews & Ratings | ✅ |
| Responsive Design | ✅ |
| Owner/Tenant Roles | ✅ |

---

## 📁 Project Structure

```
smart-housing-platform/
├── backend/
│   ├── routes/          # auth, listings, matches, chat, reviews
│   ├── middleware/       # JWT auth guard
│   ├── utils/
│   │   ├── db.js        # JSON file database
│   │   └── matchEngine.js  # Compatibility algorithm
│   ├── data/            # JSON files (auto-created on seed)
│   ├── seed.js          # Sample data seeder
│   └── server.js        # Express + Socket.io server
└── frontend/
    └── src/
        ├── pages/       # Home, Listings, Chat, Match, Profile...
        ├── components/  # Navbar, ListingCard
        └── context/     # AuthContext (global state)
```

---

## 🤝 Roommate Matching Algorithm

Compatibility score (0–100%) uses weighted cosine similarity:

| Factor | Weight |
|--------|--------|
| Budget overlap | 30% |
| Preferred location | 25% |
| Lifestyle (sleep, smoking, cleanliness) | 25% |
| Gender preference | 20% |

---

## 🛠 Tech Stack

- **Frontend:** React 18, React Router v6, Vite, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Database:** JSON flat-files (no setup required)
- **Auth:** JWT (jsonwebtoken + bcryptjs)
