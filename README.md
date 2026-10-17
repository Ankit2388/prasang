# 🍽️ Prasang Customer Frontend Application (`prasang`)

> Scalable, modular, and mobile-responsive **End-User / Customer Discovery & Booking Frontend** for the **Prasang Event & Catering Platform**, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **TanStack Query**.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture & Suggested Structure](#-architecture--suggested-structure)
- [Multi-Theme Design System](#-multi-theme-design-system)
- [Multi-Language Localization (i18n)](#-multi-language-localization-i18n)
- [Backend Integration & API Services](#-backend-integration--api-services)
- [Vendor Search, Filtering & Sorting](#-vendor-search-filtering--sorting)
- [Customer Authentication & Guest Access](#-customer-authentication--guest-access)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Quality Verification & Production Build](#-quality-verification--production-build)

---

## 🌟 Project Overview

**Prasang Customer Portal** is designed specifically for end users and event hosts looking to discover, explore, compare, and book catering services for weddings, receptions, corporate galas, and festive celebrations.

It exists as an independent application named `prasang` alongside the existing `prasang-vendor` portal and connects directly to the **Prasang Backend (`prasang-server`)** RESTful API services.

---

## ✨ Key Features

1. **Customer Home Page**:
   - Modern, celebratory hero banner with prominent search area and quick category/city shortcuts.
   - Popular cuisine categories (Traditional Gujarati, Royal North Indian & Punjabi, Indo-Chinese, South Indian) with one-click filtering.
   - Featured Caterers showcase populated directly from approved backend records.
   - "How Prasang Works" 3-step visual guide.
   - Real-time platform performance metrics (100+ Verified Caterers, 15+ Cities, 1,200+ Events, 4.9★ Satisfaction).

2. **Dedicated Vendor Listing & Discovery (`/vendors`)**:
   - Responsive multi-column layout with desktop filter sidebar and mobile filter drawer.
   - Debounced keyword search synchronized with the URL (`?search=...`).
   - Backend-supported filtering:
     - **City Filter**: Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Mumbai.
     - **Cuisine Filter**: Gujarati, North Indian, Chinese, South Indian, Continental, Street Food.
     - **Guest Capacity Filter**: Minimum Guests (`minCapacity`) and Maximum Guests (`maxCapacity`).
     - **Minimum Rating Filter**: 4.5★+, 4.0★+, 3.0★+ (`minRating`).
   - Sorting options: Highest Rated, Recently Joined, Name (A to Z).
   - Clear individual filter tags and full filter reset button.
   - Pagination controls with total result count.
   - Comprehensive loading skeletons, empty states, and retry buttons on error.

3. **Vendor Details & Menus (`/vendors/[id]`)**:
   - Dynamic routing based on backend business ID.
   - Hero header with verified caterer badge, Pure Veg indicator, location, contact, and guest capacity.
   - **Tab 1: Overview**: About the caterer, cuisines offered, guest limits breakdown, consultation hours, and address.
   - **Tab 2: Menus & Dishes**: Catering packages (e.g. Wedding Feast, High-Tea) with course categories, dish details, Pure Veg badges, and price per plate in Indian Rupee format (`₹`).
   - **Tab 3: Reviews & Testimonials**: Star ratings breakdown, verified customer testimonials, and an interactive review form for authenticated customers.

4. **Catering Estimation Request**:
   - Modal to submit guest count, event date, and custom preferences directly to the caterer (`POST /api/v1/vendors/estimation-request`).
   - Context-preserving login prompt: if an unauthenticated user requests an estimate, their request is saved in memory while prompting them to sign in or register, then returns them directly to finish the inquiry.

5. **Customer Authentication & Guest Access**:
   - Unrestricted guest browsing: no forced authentication for searching, viewing caterers, or exploring menus.
   - Customer Registration (`POST /api/v1/auth/register/user`).
   - Customer Sign In (`POST /api/v1/auth/login/user`).
   - Demo fast-fill shortcut for instant evaluation.
   - "Skip to browse as guest" links.
   - Automatic JWT token rotation via refresh token interceptor.

---

## 🎨 Multi-Theme Design System

Reuses the identical dual-theme architecture established in `prasang-vendor`:
- **Prasang Default Theme**: Warm festive saffron `#EF4C18` with soft ivory `#FDF6F2`.
- **Royal Emerald & Gold Theme**: Opulent regal emerald `#0F5132` with warm gold accent `#C59B27`.
- Persisted across browser sessions in `localStorage` under `prasang_customer_theme`.
- Smooth transitions and high-contrast accessibility.

---

## 🌐 Multi-Language Localization (i18n)

Full English (`en`) and Hindi (`hi`) translations with parameter interpolation support:
- `src/i18n/messages/en.json`
- `src/i18n/messages/hi.json`
- `LanguageProvider` with persistent preference in `localStorage` under `prasang_customer_language`.
- Easily extensible for Gujarati (`gu`) and other regional languages.

---

## 🏗️ Architecture & Suggested Structure

```text
prasang/
├── src/
│   ├── app/
│   │   ├── globals.css              # Centralized dual-theme CSS variables & Tailwind v4
│   │   ├── layout.tsx               # Root layout wrapping AppProviders, Navbar, and Footer
│   │   ├── page.tsx                 # Customer Home & Discovery landing
│   │   ├── vendors/
│   │   │   ├── page.tsx             # Dedicated Vendor Listing with search & filters
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Detailed Caterer profile, menus, dishes, & reviews
│   │   ├── login/page.tsx           # Customer Sign In screen
│   │   └── register/page.tsx        # Customer Registration screen
│   ├── components/
│   │   ├── ui/                      # Reusable atom components (button, input, card, badge, modal, select, etc.)
│   │   ├── layout/                  # Navbar, Footer, ThemeToggle, LanguageToggle
│   │   └── shared/                  # VendorCard, EstimationModal, EmptyState
│   ├── context/
│   │   ├── theme-context.tsx        # Dual-theme provider (Prasang / Emerald)
│   │   ├── language-context.tsx     # i18n translation provider (en / hi)
│   │   └── auth-context.tsx         # Customer auth session & action preserver
│   ├── providers/
│   │   ├── query-provider.tsx       # TanStack Query client provider
│   │   └── app-providers.tsx        # Aggregated providers wrapper
│   ├── services/
│   │   ├── api-client.ts            # Centralized Axios client with Bearer & 401 refresh
│   │   ├── api-error.ts             # Standardized operational error class
│   │   ├── auth.service.ts          # Customer login/register/logout calls
│   │   ├── business.service.ts      # Business listing with query filters & details
│   │   ├── vendor.service.ts        # Public vendors & estimation request calls
│   │   ├── menu.service.ts          # Menus & dishes calls
│   │   └── review.service.ts        # Reviews listing & creation calls
│   ├── types/                       # Strict TypeScript interfaces matching backend models
│   └── lib/
│       └── utils.ts                 # Styling (cn) and Indian currency (₹) / date formatters
├── public/
├── .env.example
├── .env.local
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 18.0.0` (Node 20+ recommended)
- **Prasang Server** running locally on `http://localhost:5001` (or your backend URL)

### 1. Installation
```bash
cd prasang
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to your active `prasang-server` endpoint:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

### 3. Start Development Server
```bash
npm run dev -- -p 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser. (Port 3001 is used so it can run concurrently with `prasang-vendor` on port 3000).

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with hot-reloading |
| `npm run build` | Compiles optimized production bundle with strict TypeScript checking |
| `npm run start` | Runs the compiled Next.js production server |
| `npm run lint` | Runs ESLint analysis across all components and pages |

---

## 🛡️ Production & Quality Verification

- **Strict TypeScript Checking**: Zero compilation errors or `any` compromises.
- **ESLint Clean**: Verified with ESLint 9 core web vitals.
- **Production Build**: Verified with Next.js Turbopack compiler (`npm run build`).
- **Responsive**: Fully tested across mobile, tablet, and desktop viewports.
