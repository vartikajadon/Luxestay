# 🏨 LuxeStay - Premium Hotel Booking & Management Platform

**LuxeStay** is an end-to-end luxury hospitality and hotel reservation platform featuring real-time room discovery, OTP-authenticated user login, role-based dashboards, dining and experience bookings, and database synchronization via Supabase and Node.js/Express.

---

## ✨ Features

- **🏨 Hotel Discovery & Booking**: Search curated luxury hotels and suites by city or property name with live ratings, pricing, and amenities.
- **🔐 Secure OTP Authentication**: Integrated custom Gmail SMTP Nodemailer OTP verification flow synced with Supabase Profiles.
- **👥 Multi-Role Support**:
  - **Guest Dashboard**: Manage personal bookings, food orders, digital room keys, and billing statement history.
  - **Partner / Property Manager Dashboard**: Register property listings, set pricing, view occupancy statistics, and manage incoming reservations.
  - **Staff Dashboard**: Room status tracking, guest check-ins, service request fulfillments, and task management.
  - **Admin Dashboard**: System-wide operations, analytics, user administration, and security configurations.
- **🍽️ In-House Dining & Services**: Interactive dining menu ordering and luxury experiences booking.
- **⚡ Fast Express & Supabase Backend**: RESTful API endpoints for hotel query matching, OTP distribution, and database upserts.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern Vanilla CSS (Glassmorphism design tokens), Dynamic JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL), Custom SQL Schemas (`supabase_schema.sql`, `curated_hotels.sql`)
- **Services**: Nodemailer (Gmail SMTP for OTP delivery), CORS, Dotenv

---

## 📁 Repository Structure

```
PRD_app/
├── index.html                    # Main Landing & Hotel Showcase Page
├── server.js                     # Express API Server & SMTP/Supabase Integration
├── package.json                  # Dependencies & Node Scripts
├── .env.example                  # Environment variable configuration template
├── .gitignore                    # Prevents uploading sensitive files & dependencies
│
├── 🎨 Styling & Assets
│   ├── style.css                 # Global CSS Tokens & Layouts
│   ├── dashboard.css             # Guest Dashboard Styling
│   ├── admin-dashboard.css       # Admin Portal Styling
│   ├── login.css                 # Authentication Page Styling
│   └── assets/                   # Images, Icons & Media Assets
│
├── 🔐 Authentication & Security
│   ├── login.html                # User Login & Registration
│   ├── verify.html               # OTP Input & Verification Page
│   ├── verify.js                 # Verification Client Logic
│   ├── auth-service.js           # Authentication Utilities
│   └── supabase-config.js        # Supabase Client Configuration
│
├── 💻 Dashboards & Portals
│   ├── dashboard.html            # Guest Account Portal
│   ├── partner-dashboard.html    # Partner Management Hub
│   ├── staff-dashboard.html      # Hotel Staff Operational Portal
│   ├── admin-dashboard.html      # System Administrator Console
│   └── management-dashboard.html # Management Overview
│
├── 🛏️ Pages & Booking Flows
│   ├── explore-room.html         # Room Details & Specifications
│   ├── checkout.html             # Reservation Payment & Checkout
│   ├── my-bookings.html          # Active Guest Bookings
│   ├── billing.html              # Invoice & Payment Records
│   ├── dining.html               # Restaurant & Room Service Menu
│   └── experiences.html          # Curated Guest Activities
│
└── 🗄️ Database Schemas
    ├── supabase_schema.sql       # User Profiles & Core Database Schema
    ├── supabase_schema_custom_auth.sql # Custom Auth Extension SQL
    └── curated_hotels.sql        # Hotel Inventory & Seed Data
```

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vartikajadon/Luxestay.git
   cd Luxestay
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Fill in your actual credentials in `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   # or
   npm start
   ```

5. **Access the Web Application**
   Open your browser and navigate to `http://localhost:5000`.

---

## 🔒 Security Note

The `.env` file containing sensitive SMTP app passwords and Supabase API credentials is explicitly included in `.gitignore` and is **never** committed to the GitHub repository.

---

## 📄 License

This project is licensed under the ISC License.
