# 🏨 LuxeStay - Comprehensive Project & Technical Documentation

---

## 📌 1. Executive Summary & Vision

**LuxeStay** is a state-of-the-art, end-to-end luxury hospitality platform designed to unify the entire guest lifecycle and hotel operational ecosystem into a single seamless experience. 

From room discovery and secure OTP-based authentication to real-time room key generation, interactive dining orders, multi-role staff dashboards, property partner onboarding, and financial analytics—LuxeStay provides a modern, responsive, and visual-first web application.

---

## 🏗️ 2. High-Level Architecture & Tech Stack

```mermaid
graph TD
    Client[Browser / Client Tier - Vanilla JS + CSS Glassmorphism]
    Client -->|HTTP / REST API| ExpressServer[Express.js Server Tier - server.js]
    Client -->|Direct DB Queries / Realtime| Supabase[Supabase Database Tier - PostgreSQL]
    ExpressServer -->|Nodemailer SMTP| Gmail[Gmail SMTP - OTP Verification]
    ExpressServer -->|@supabase/supabase-js| Supabase
```

### **Core Technologies**

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, Modern CSS3 (Glassmorphism, CSS Grid, Custom Tokens) | High-performance, rich aesthetic user interfaces |
| **Icons & Fonts** | Phosphor Icons, Google Fonts (Cinzel, Plus Jakarta Sans) | Luxury typography and visual hierarchy |
| **Interactive Media** | HTML5 `<video>`, 360° Panorama Viewers | Immersive room tours & background visualizers |
| **Backend API** | Node.js, Express.js | Custom OTP authentication, hotel search API, CORS middleware |
| **Database & Auth** | Supabase (PostgreSQL), Custom SQL Schemas | User profiles, hotel inventory, bookings, menu items, orders |
| **Email Service** | Nodemailer (Gmail SMTP) | Transactional email delivery for 6-digit login OTPs |
| **Deployment** | Vercel (`vercel.json`), GitHub (`main` branch) | Serverless functions for Express API & static edge hosting |

---

## 👥 3. User Roles & Multi-Portal System

LuxeStay supports **4 distinct user personas**, each equipped with tailored permissions and dedicated user interfaces:

```
                          ┌──────────────────────────┐
                          │    LuxeStay Ecosystem    │
                          └────────────┬─────────────┘
                                       │
         ┌──────────────────┬──────────┴───────────┬──────────────────┐
         ▼                  ▼                     ▼                  ▼
  ┌──────────────┐   ┌──────────────┐      ┌──────────────┐   ┌──────────────┐
  │    Guest     │   │   Partner    │      │  Hotel Staff │   │ System Admin │
  │   (Client)   │   │ (Property)   │      │ (Operations) │   │ (Management) │
  └──────────────┘   └──────────────┘      └──────────────┘   └──────────────┘
```

### **1. Guest Persona (`guest`)**
- Search luxury hotels by city or property name.
- View 360° interactive room video previews and detailed room specifications.
- Complete room reservations with automated price calculation (taxes, resort fees).
- Receive custom 6-digit OTP codes via email for instant passwordless login/verification.
- Access digital key cards with live NFC room door unlocking simulation.
- Order in-room dining, request concierge services, and download PDF billing statements.

### **2. Property Partner Persona (`partner`)**
- Register new luxury hotel listings with image URLs, room pricing, and amenities.
- Track room occupancy rates, active guest check-ins, and reservation revenue.
- Accept or decline incoming guest booking requests.

### **3. Hotel Staff Persona (`staff`)**
- Track room status (Cleaned, Occupied, Maintenance Needed).
- Manage assigned service tickets (Extra towels, room cleaning, luggage assistance).
- Update order delivery status for room service items.

### **4. System Administrator Persona (`admin`)**
- System-wide revenue, booking, and guest profile metrics.
- Manage restaurant menu inventory (Add, edit, or delete dishes with pricing & photos).
- Export financial reports as downloadable CSV files.
- Monitor active user roles and system security settings.

---

## ⚡ 4. Detailed Feature Breakdown & User Workflows

### **4.1. Passwordless OTP Authentication Flow**
1. Guest enters email address and name on `login.html` or `verify.html`.
2. Client sends a POST request to `/send-otp`.
3. Backend generates a cryptographically random 6-digit numeric OTP valid for 5 minutes.
4. Nodemailer delivers a branded HTML email template to the user's Gmail address.
5. User enters the code on `verify.html`.
6. Server verifies the code from memory, upserts the user's profile in Supabase `profiles` table, and logs the user in.

```
Guest Input Email ──► POST /send-otp ──► Generate 6-Digit OTP ──► Send Gmail ──► Submit OTP ──► POST /verify-otp ──► Upsert Supabase Profile
```

---

### **4.2. Hotel Search & Discovery Engine**
- Interactive search hub on `index.html` allows filtering by destination city, check-in/out dates, and guest count.
- Hits Express endpoint `/api/hotels/search?city=...` which executes a case-insensitive SQL query against Supabase `hotels` table.
- Renders hotel cards with live ratings, price per night, background photos, and amenities badges.

---

### **4.3. 360° Virtual Room Tour & Booking Pipeline**
- Guests explore suite options (`explore-room.html`) featuring interactive 360° video visualizers for Deluxe Rooms, Luxury Suites, Balcony View Rooms, and Presidential Suites.
- Booking checkout page (`checkout.html`) calculates line items:
  - Base Room Rate × Total Nights Stayed
  - Luxury Resort Tax (18%)
  - Refundable Security Deposit
- Payment support via simulated Credit/Debit Card or instant UPI QR Code scan.

---

### **4.4. In-Room Digital Key & Smart Access (`room-access.html`)**
- Active guests can view their digital room key with dynamic door lock status (`LOCKED` / `UNLOCKED`).
- Tap-to-unlock triggers a pulse animation, simulated NFC signal exchange, and status update.

---

### **4.5. In-House Dining & Concierge Ordering (`dining.html`, `services.html`)**
- Categorized food & beverage catalog: *Breakfast, Indian Cuisine, Continental, Beverages, Desserts*.
- Interactive shopping cart modal with live total price calculator.
- Orders persist to Supabase `orders` table and dispatch real-time notifications to hotel staff.

---

## 🗄️ 5. Database Schema & Data Models

The database consists of **PostgreSQL** tables hosted on Supabase:

### **`profiles`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Unique user identifier |
| `email` | `TEXT (UNIQUE)` | User email address |
| `full_name` | `TEXT` | Guest or staff name |
| `password` | `TEXT` | Hashed/cached login credentials |
| `role` | `TEXT` | User role (`guest`, `partner`, `staff`, `admin`) |
| `created_at` | `TIMESTAMP` | Account creation timestamp |

### **`hotels`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Hotel ID |
| `hotel_name` | `TEXT` | Property title |
| `city` | `TEXT` | Location city |
| `country` | `TEXT` | Country |
| `rating` | `NUMERIC` | Guest review score (e.g., 4.9) |
| `price_per_night` | `NUMERIC` | Base nightly rate |
| `image_url` | `TEXT` | Primary hotel cover image URL |
| `amenities` | `TEXT[]` | Array of amenity strings |

### **`bookings`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Reservation ID |
| `user_email` | `TEXT` | Foreign reference to guest email |
| `hotel_name` | `TEXT` | Reserved property name |
| `room_type` | `TEXT` | Suite category |
| `check_in` | `DATE` | Arrival date |
| `check_out` | `DATE` | Departure date |
| `total_price` | `NUMERIC` | Calculated booking total |
| `status` | `TEXT` | `Confirmed`, `Checked-In`, `Completed`, `Cancelled` |

### **`menu_items`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Dish ID |
| `name` | `TEXT` | Dish name |
| `category` | `TEXT` | Food category |
| `price` | `NUMERIC` | Item price in INR |
| `image_url` | `TEXT` | Unsplash or uploaded food photo |

---

## 📡 6. Backend API Reference

### **`POST /send-otp`**
Sends a custom 6-digit OTP code to a specified email address.
- **Request Body**:
  ```json
  {
    "email": "guest@example.com",
    "name": "Jane Doe",
    "password": "optional_password"
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully."
  }
  ```

### **`POST /verify-otp`**
Validates a received OTP code and synchronizes user profile to Supabase.
- **Request Body**:
  ```json
  {
    "email": "guest@example.com",
    "otp": "492815"
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "user": {
      "email": "guest@example.com",
      "full_name": "Jane Doe",
      "role": "guest"
    }
  }
  ```

### **`GET /api/hotels/search`**
Queries curated hotel registry by city or hotel name.
- **Query Parameter**: `?city=Mumbai`
- **Response Success (200)**: Array of matching hotel objects.

---

## 🚀 7. Deployment & Environment Setup

### **Environment Variables (`.env`)**
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
RAPIDAPI_KEY=your_rapidapi_key
```

### **Vercel Serverless Configuration (`vercel.json`)**
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "**/*.html", "use": "@vercel/static" },
    { "src": "assets/**", "use": "@vercel/static" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/send-otp", "dest": "/server.js" },
    { "src": "/verify-otp", "dest": "/server.js" },
    { "src": "/login", "dest": "/server.js" },
    { "src": "/api/(.*)", "dest": "/server.js" },
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/public/(.*)", "dest": "/public/$1" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

---

## 🌐 8. Project Repository

- **GitHub Repository**: [https://github.com/vartikajadon/Luxestay](https://github.com/vartikajadon/Luxestay)
- **Primary Branch**: `main`
