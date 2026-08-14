# Southern Impex — Complete System Sitemap & Route Index

This document provides a comprehensive, interactive sitemap and navigation taxonomy for the **Southern Impex** Wholesale Master Supply House digital platform. It details all public frontend pages, category detail views, admin management routes, REST API endpoints, and static asset mappings.

---

## 🌐 1. Public Web Portal (Frontend Pages & Sections)

| Page / File | Route Path | Primary Purpose & Content Focus | Priority | Change Freq |
| :--- | :--- | :--- | :---: | :---: |
| **Home Landing Hub** | [`frontend/index.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/index.html) | Main gateway, Cinematic Video Hero, Story, Brands Showcase, Category Overview, Branch Hub, Quote Modal | `1.0` | `daily` |
| **Flex Banner Media** | [`frontend/flex.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/flex.html) | Frontlit, Backlit, Black Back, and Blockout Flex media specifications | `0.9` | `weekly` |
| **QREX Premium Flex** | [`frontend/qrex-flex.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/qrex-flex.html) | High-precision QREX banner series for extreme weather signage | `0.85` | `weekly` |
| **Cast Acrylic Sheets** | [`frontend/acrylic.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/acrylic.html) | Clear, Opal White, Color Tint, and Textured Acrylic sheets catalog | `0.9` | `weekly` |
| **PVC Foam & Forex** | [`frontend/pvc.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/pvc.html) | Lightweight PVC foam boards, rigid Forex sheets for signage & displays | `0.9` | `weekly` |
| **Aluminum Composite Panels (ACP)** | [`frontend/acp.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/acp.html) | Architectural cladding, signboards, metallic & solid color ACP panels | `0.9` | `weekly` |
| **Self-Adhesive Vinyls** | [`frontend/vinyl.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/vinyl.html) | Monomeric, Polymeric, Translucent, and High-Tack vinyl films | `0.9` | `weekly` |
| **Starflex Vinyl Series** | [`frontend/starflex-vinyl.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/starflex-vinyl.html) | Heavy-duty Korean Starflex media for large-format hoardings | `0.85` | `weekly` |
| **Sunstar Vinyl Media** | [`frontend/sunstar-vinyl.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/sunstar-vinyl.html) | Sunstar eco-solvent printable vinyl & gloss/matte overlay films | `0.85` | `weekly` |
| **PE Protective Sheets** | [`frontend/pe-sheets.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/pe-sheets.html) | Polyethylene surface protection films & industrial plastic sheets | `0.85` | `weekly` |
| **LED Modules & Power** | [`frontend/led.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/led.html) | Injection LED modules, waterproof SMPS power supplies, strip lights | `0.9` | `weekly` |
| **Textile & Canvas Cloth** | [`frontend/cloth-canvas.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/cloth-canvas.html) | Eco-solvent printable fabric, polyester canvas, banner textiles | `0.85` | `weekly` |
| **Admin Gateway** | [`frontend/admin.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/frontend/admin.html) | Client-side redirect gateway to the administrative portal | `0.3` | `monthly` |

---

## 🔐 2. Administrative Dashboard Portal (`/admin`)

| Dashboard View | Path | Description & Features | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin Login & Dashboard** | [`admin/index.html`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/admin/index.html) | Protected admin portal interface featuring JWT authentication, lead/inquiry management table, lead status updates (`pending`, `contacted`, `quote_sent`, `closed`), and product catalog inventory management. | Admin / Manager / Sales |
| **Admin Styling** | [`admin/admin.css`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/admin/admin.css) | Custom dark-mode responsive admin dashboard styling. | System Asset |
| **Admin Logic Engine** | [`admin/admin.js`](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/admin/admin.js) | JWT local storage auth state controller, asynchronous API fetch handler, modal dialog manager, dynamic table rendering. | System Asset |

---

## ⚡ 3. REST API Endpoint Map (Backend Tier)

Base API URL: `http://localhost:5000/api` (Production: `https://api.southernimpex.com/api`)

### Health & System Check
- `GET /api/health` — Returns REST API status, environment variable status, and current server timestamp.

### Authentication Domain (`/api/auth`)
- `POST /api/auth/register` — Seed/Register a new admin/manager user (`name`, `email`, `password`, `role`).
- `POST /api/auth/login` — User authentication (`email`, `password`). Returns signed JWT token & user profile.
- `GET /api/auth/profile` — Fetch authenticated user details (Requires `Authorization: Bearer <token>`).

### Customer Lead & Inquiry Domain (`/api/inquiries`)
- `POST /api/inquiries` — Public endpoint to submit quote requests / inquiries from website modal & contact forms.
- `GET /api/inquiries` — Protected endpoint to retrieve all submitted customer inquiries (Filterable by `status`, `category`).
- `GET /api/inquiries/:id` — Fetch single inquiry details by MongoDB ID.
- `PUT /api/inquiries/:id/status` — Update inquiry processing state (`pending` -> `contacted` -> `quote_sent` -> `closed`).
- `DELETE /api/inquiries/:id` — Delete inquiry record from database.

### Product Catalog Management (`/api/products`)
- `GET /api/products` — Retrieve full product list or filter by category (`?category=acrylic`, `?brand=STARFLEX`).
- `GET /api/products/:slug` — Retrieve single product details by unique URL slug.
- `POST /api/products` — Add a new product item (Protected, Admin only).
- `PUT /api/products/:id` — Edit product details/specs (Protected, Admin only).
- `DELETE /api/products/:id` — Remove product entry (Protected, Admin only).

### Interactive Branch Network Domain (`/api/branches`)
- `GET /api/branches` — Retrieve list of active branches (`kochi-ho`, `kochi-tech`, `calicut`, `trivandrum`).
- `POST /api/branches` — Register a new branch location with Google Maps embed link (Admin only).
- `PUT /api/branches/:id` — Update branch contact details, hotline, address, map links (Admin only).
- `DELETE /api/branches/:id` — Deactivate or remove branch (Admin only).

---

## 📁 4. Static Assets & Media Registry

```
southan_impex/
├── sitemap.xml                         # Root XML Sitemap
├── SITEMAP.md                          # Comprehensive System Sitemap & Route Index
├── ARCHITECTURE.md                     # Technical Architecture Specification
├── FLOW.md                             # UX & System Process Flow diagrams
├── frontend/
│   ├── sitemap.xml                     # Frontend XML Sitemap for Search Engines
│   ├── style.css                       # Tokenized Vanilla CSS Design System
│   ├── script.js                       # Frontend Event Delegation & DOM Engine
│   └── assets/                         # Video backgrounds, hero images, product thumbnails, logos
├── admin/
│   ├── index.html                      # Admin Portal Interface
│   ├── admin.css                       # Admin Panel Stylesheet
│   └── admin.js                        # Admin Panel API & State Controller
└── backend/
    ├── server.js                       # Express Application Server Entry Point
    ├── seed.js                         # Database Initializer & Demo Seeder
    ├── config/db.js                    # MongoDB Mongoose Connection Module
    ├── middleware/                     # JWT Auth & Error Handling Middlewares
    ├── models/                         # Mongoose Data Schemas (Branch, Inquiry, Product, User)
    ├── routes/                         # Express Domain Routers
    └── controllers/                    # REST Controller Functions
```

---

## 🔍 5. Search Engine & SEO Metadata Guidelines

1. **Canonical URLs**: All public URLs follow the canonical pattern `https://www.southernimpex.com/<filename>.html`.
2. **Indexing Directives**:
   - `index.html` through `cloth-canvas.html`: `index, follow` enabled with specific open-graph meta tags.
   - `admin/index.html` & `frontend/admin.html`: `noindex, nofollow` configured to protect management interfaces.
3. **Sitemap Protocol**: Conforms strictly to Sitemaps XML Schema 0.9.
