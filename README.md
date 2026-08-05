# Southern Impex — Master Signage Material Wholesale House

Welcome to the official web application repository for **Southern Impex**, South India's premier wholesale importer and master supply house for high-grade signage raw materials since 2007.

---

## 📌 Executive Overview

Southern Impex operates as the primary master distributor across Kerala and South India for Cast Acrylic Sheets (ASTRYX™), Self-Adhesive Vinyls (Starflex, Sunstar), Flex Media (Qrex), ACP Composite Facade Panels, PVC Foam Boards, and Samsung LED Lighting Modules.

This web application serves advertising agencies, commercial printing hubs, architectural fabricators, and sign makers by showcasing raw material specifications, brand distributions, branch locations, and instant quote inquiry management.

---

## ✨ Core Features & Key Modules

1. **Cinematic Hero Landing**: High-definition video backdrop showcase with dynamic typography and call-to-action buttons.
2. **Interactive Branch Network Hub**:
   - Live **Network Serial Bus Ticker** displaying all regional depots.
   - **4 Kerala Branch Depots**: Kochi (Head Office), Southern Sign Technology (Kochi), Southern Sales Corporation (Calicut), and Southern Impex Trivandrum.
   - Instant 1-click location switching with dynamic Google Maps viewports, address details, phone contacts, and direct directions links.
3. **Product Catalog & Category Showcase**:
   - Comprehensive pages for Flex Printing Media, Self-Adhesive Vinyls, Cast Acrylic, ACP Facade Panels, PVC Sunboard, Cloth/Canvas Media, Polyethylene Sheets, and Samsung Signage LEDs.
   - Category filtering tabs and brand distribution catalogs.
4. **Interactive Trade Inquiry & Quote Modal**:
   - Instant inquiry submission form with toast notification feedback.
   - Product-specific quote request pop-up dialog accessible across all catalog items.
5. **Animated Key Performance Metrics**: Auto-counting performance metrics (18+ Years Leadership, 50,000+ sq.ft. Warehouse Capacity, PAN Kerala Logistics).

---

## 📁 Repository Directory Structure

```
project_bussiness1/
└── southan_impex/
    ├── README.md               # Project documentation & overview
    ├── ARCHITECTURE.md         # Full system architecture specs & Mermaid diagrams
    ├── FLOW.md                 # User navigation & feature interaction flowcharts
    ├── frontend/               # Complete Frontend Web Application
    │   ├── index.html          # Main landing page & branch map hub
    │   ├── style.css           # Vanilla CSS design system, variables & animations
    │   ├── script.js           # ES6 JavaScript interactive logic & map switcher
    │   ├── acrylic.html        # ASTRYX™ Cast Acrylic Sheets product page
    │   ├── acp.html            # ACP Facade Panels product page
    │   ├── flex.html           # Flex Printing Media product page
    │   ├── vinyl.html          # Self-Adhesive Vinyl Media product page
    │   ├── led.html            # Signage LED Lighting product page
    │   ├── pvc.html            # PVC Foam Boards & Sunboard product page
    │   ├── cloth-canvas.html   # Cloth & Canvas Printing Media page
    │   ├── pe-sheets.html      # Polyethylene Flexible Sheets page
    │   ├── qrex-flex.html      # Qrex Flex Media detail page
    │   ├── starflex-vinyl.html # Starflex Vinyl detail page
    │   ├── sunstar-vinyl.html  # Sunstar Vinyl detail page
    │   └── assets/             # Brand logos, video media & showcase images
    └── backend/                # Backend API Service (Laravel + MySQL)
        └── README.md           # Backend service specs
```

---

## 🛠️ Technology Stack

### Frontend
- **Markup**: HTML5 Semantic Architecture (SEO-optimized tags, Schema.org structure).
- **Styling**: Vanilla CSS3 (Custom Design Tokens, HSL color palette, Glassmorphism UI, CSS Grid, Flexbox, Keyframe Animations).
- **Interactive Logic**: Vanilla JavaScript (ES6+, DOM Manipulation, Event Handling, IntersectionObserver API).
- **Mapping**: Google Maps Embed API & Direct Navigation Deep Links.

### Backend (Architecture Ready)
- **Framework**: PHP / Laravel MVC framework.
- **Database**: MySQL relational database for products, inquiries, and customer leads.

---

## 🚀 Getting Started (Local Development)

### Running the Frontend
1. Open the project directory:
   ```bash
   cd "southan_impex/frontend"
   ```
2. Open `index.html` in any web browser or start a lightweight dev server:
   ```bash
   npx serve .
   # OR python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

---

## 📄 Documentation Links

- [ARCHITECTURE.md](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/ARCHITECTURE.md) — Detailed Architecture Blueprint & Component Specifications.
- [FLOW.md](file:///c:/Users/Jainish%20pachori/project_bussiness1/southan_impex/FLOW.md) — Complete User Journey & System Interaction Flowcharts.
