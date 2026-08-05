# Southern Impex — User Experience & Feature Flowcharts

This document outlines the complete user journey, page navigation flows, and interactive component state diagrams using Mermaid flowcharts.

---

## 🗺️ 1. Master Site Navigation & User Journey Flow

```mermaid
graph TD
    Start(["User Enters Website"]) --> Hero["Hero Section (Video Background)"]
    
    Hero --> NavChoice{"User Action"}
    
    NavChoice -->|"Explore Story"| About["About Us Section"]
    NavChoice -->|"Find Branches"| BranchHub["Branch Locations & Maps Hub"]
    NavChoice -->|"Browse Catalog"| ProductCatalog["Product Categories Grid"]
    NavChoice -->|"View Authorized Brands"| Brands["Authorized Brands Showcase"]
    NavChoice -->|"Request Price Quote"| ModalForm["Quote Modal Dialog"]
    NavChoice -->|"Send Bulk Inquiry"| ContactForm["Direct Contact Desk Form"]
    
    About --> BranchHub
    BranchHub --> MapView["Interactive Live Map & GPS Link"]
    
    ProductCatalog -->|"Click Category"| CategoryPage["Specific Category View (e.g. flex.html)"]
    CategoryPage -->|"Click Product Quote"| ModalForm
    
    ModalForm -->|"Submit Quote Request"| ToastMsg["Toast Notification: Request Received!"]
    ContactForm -->|"Submit Inquiry"| ToastMsg
    
    ToastMsg --> End(["Sales Team Dispatch & Callback"])
```

---

## 📍 2. Interactive Branch Network Hub Flow

This flowchart illustrates how user touches/clicks on the Branch Selector Pills or the Serial Bus Ticker dynamically update the Branch Hub view without page reloads.

```mermaid
flowchart TD
    UserLand(["User Scrolls to Branch Section"]) --> DefaultState["Default State Loaded: Kochi Head Office"]
    
    DefaultState --> ActionChoice{"User Touches / Clicks Branch"}
    
    ActionChoice -->|"Click Kochi Tab / Ticker"| SwitchKochi["Switch State to 'kochi-ho'"]
    ActionChoice -->|"Click Sign Tech Tab / Ticker"| SwitchTech["Switch State to 'kochi-tech'"]
    ActionChoice -->|"Click Calicut Tab / Ticker"| SwitchCalicut["Switch State to 'calicut'"]
    ActionChoice -->|"Click Trivandrum Tab / Ticker"| SwitchTVM["Switch State to 'trivandrum'"]
    
    SwitchKochi --> UpdateDOM["Fetch Metadata from branchDataMap"]
    SwitchTech --> UpdateDOM
    SwitchCalicut --> UpdateDOM
    SwitchTVM --> UpdateDOM
    
    UpdateDOM --> DOM1["Update Tab Active State & Glowing Accent"]
    UpdateDOM --> DOM2["Update Branch Badge, Name, Subtitle"]
    UpdateDOM --> DOM3["Update Address & Phone Number Contact Details"]
    UpdateDOM --> DOM4["Update Direct Directions Link (Google Maps)"]
    UpdateDOM --> DOM5["Fade-transition Google Maps Iframe Source"]
    
    DOM5 --> UserNavChoice{"User Action on Active Branch"}
    UserNavChoice -->|"Click Open in Google Maps"| ExternalGmaps(["Opens Google Maps App / Navigation"])
    UserNavChoice -->|"Select Another Branch"| ActionChoice
```

---

## 📩 3. Product Catalog & Quote Request Modal Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Trade Client
    participant UI as Website Frontend (HTML/JS)
    participant Modal as Quote Request Modal
    participant Engine as Notification Engine
    participant Sales as Wholesale Sales Desk

    Customer->>UI: Browse Product Category (e.g., Cast Acrylic / ACP Sheets)
    Customer->>UI: Click "Request Bulk Quote" Button
    UI->>Modal: Open Glassmorphic Modal Dialog
    UI->>Modal: Pre-select Product Option in Select Dropdown
    Customer->>Modal: Enter Full Name, Phone Number, Quantity Details
    Customer->>Modal: Click "Submit Quote Request"
    Modal->>UI: Close Modal Dialog
    UI->>Engine: Trigger showToast("Quote Request Submitted")
    Engine->>Customer: Display Floating Animated Toast Notification
    UI->>Sales: Forward Lead Data to Wholesale Team
```

---

## 📱 4. Mobile Navigation Menu Toggle Flow

```mermaid
flowchart TD
    MobileUser(["Mobile User (Width < 992px)"]) --> ClickHamburger["Click Mobile Toggle Button"]
    
    ClickHamburger --> CheckState{"Is Nav Menu Active?"}
    
    CheckState -->|"No"| OpenMenu["Add 'active' Class to .nav-menu"]
    OpenMenu --> TransformIcon["Transform Hamburger Bars to 'X' Icon"]
    
    CheckState -->|"Yes"| CloseMenu["Remove 'active' Class from .nav-menu"]
    CloseMenu --> ResetIcon["Reset 'X' Icon back to Hamburger Bars"]
    
    OpenMenu --> UserSelectLink["User Clicks Nav Link (e.g. #branches)"]
    UserSelectLink --> SmoothScroll["Smooth Scroll to Target Section"]
    UserSelectLink --> CloseMenu
```
