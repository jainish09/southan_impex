# Southern Impex — User Experience, System & API Flowcharts

This document details the user journeys, page navigation flows, component state transitions, admin lead processing lifecycle, and backend REST API data flows using Mermaid flowcharts.

---

## 🗺️ 1. Master Site Navigation & User Journey Flow

```mermaid
graph TD
    Start(["User Enters Website"]) --> Hero["Hero Section (Cinematic Video Background)"]
    
    Hero --> NavChoice{"User Action Choice"}
    
    NavChoice -->|"Explore Story"| About["About Us Section"]
    NavChoice -->|"Find Branches"| BranchHub["Branch Locations & Maps Hub"]
    NavChoice -->|"Browse Catalog"| ProductCatalog["Product Categories Grid"]
    NavChoice -->|"View Authorized Brands"| Brands["Authorized Brands Showcase"]
    NavChoice -->|"Request Price Quote"| ModalForm["Quote Request Modal Dialog"]
    NavChoice -->|"Send Direct Message"| ContactForm["Direct Contact Desk Form"]
    
    About --> BranchHub
    BranchHub --> MapView["Interactive Live Map & GPS Link"]
    
    ProductCatalog -->|"Click Category"| CategoryPage["Specific Category Page (e.g. acrylic.html, flex.html, led.html)"]
    CategoryPage -->|"Click Request Quote"| ModalForm
    
    ModalForm -->|"Submit Form"| APIPost["POST /api/inquiries (REST API)"]
    ContactForm -->|"Submit Inquiry"| APIPost
    
    APIPost -->|"201 Created"| ToastMsg["Toast Notification: Quote Request Submitted!"]
    ToastMsg --> SalesDesk(["Sales Team Notification & Lead Processing"])
```

---

## 📍 2. Interactive Branch Network Hub Switching Flow

```mermaid
flowchart TD
    UserLand(["User Scrolls to Branch Network Section"]) --> DefaultState["Default Active State: Kochi Head Office"]
    
    DefaultState --> ActionChoice{"User Touches / Clicks Branch Tab or Ticker"}
    
    ActionChoice -->|"Click Kochi Tab / Ticker"| SwitchKochi["Switch Branch State to 'kochi-ho'"]
    ActionChoice -->|"Click Sign Tech Tab / Ticker"| SwitchTech["Switch Branch State to 'kochi-tech'"]
    ActionChoice -->|"Click Calicut Tab / Ticker"| SwitchCalicut["Switch Branch State to 'calicut'"]
    ActionChoice -->|"Click Trivandrum Tab / Ticker"| SwitchTVM["Switch Branch State to 'trivandrum'"]
    
    SwitchKochi --> UpdateDOM["Fetch Metadata from branchDataMap Dictionary"]
    SwitchTech --> UpdateDOM
    SwitchCalicut --> UpdateDOM
    SwitchTVM --> UpdateDOM
    
    UpdateDOM --> DOM1["Update Active Segment Pill & Glowing Accent"]
    UpdateDOM --> DOM2["Update Branch Badge, Name & Division Tag"]
    UpdateDOM --> DOM3["Update Street Address & Phone Numbers"]
    UpdateDOM --> DOM4["Update Direct GPS Directions Navigation Link"]
    UpdateDOM --> DOM5["Fade-transition Google Maps Embedded Iframe Source"]
    
    DOM5 --> UserNavChoice{"User Action on Selected Branch"}
    UserNavChoice -->|"Click Get Directions"| ExternalGmaps(["Opens Google Maps GPS App / Direct Navigation"])
    UserNavChoice -->|"Select Another Branch"| ActionChoice
```

---

## 📩 3. Product Catalog & Quote Request Modal Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Wholesale Buyer
    participant UI as Website Frontend (HTML/JS)
    participant Modal as Quote Request Modal
    participant API as Express REST API Backend
    participant DB as MongoDB Database
    participant Toast as Notification Engine

    Customer->>UI: Browse Product Catalog (e.g. Acrylic Sheets / Flex Media)
    Customer->>UI: Click "Request Bulk Quote" Button
    UI->>Modal: Open Glassmorphic Dialog & Lock Body Scroll
    UI->>Modal: Pre-select Selected Product Title in Dropdown
    Customer->>Modal: Input Customer Name, Phone, Email, Branch, & Requirements
    Customer->>Modal: Click "Submit Quote Request" Button
    Modal->>API: POST /api/inquiries (Payload: name, phone, product, message...)
    API->>DB: Save New Inquiry Document (Status: 'pending')
    DB-->>API: Inquiry Saved Successfully
    API-->>Modal: Return 201 Created Response
    Modal->>UI: Close Modal & Unlock Body Scroll
    UI->>Toast: Trigger showToast("Quote Request Received!")
    Toast->>Customer: Display Floating Animated Success Toast
```

---

## 📱 4. Mobile Navigation Menu Toggle & Responsive Flow

```mermaid
flowchart TD
    MobileUser(["Mobile Viewport < 992px"]) --> ClickHamburger["User Clicks Mobile Menu Toggle"]
    
    ClickHamburger --> CheckState{"Is Nav Menu Currently Active?"}
    
    CheckState -->|"No"| OpenMenu["Add '.active' Class to Nav Menu"]
    OpenMenu --> TransformIcon["Transform Hamburger Icon to 'X' Close"]
    
    CheckState -->|"Yes"| CloseMenu["Remove '.active' Class from Nav Menu"]
    CloseMenu --> ResetIcon["Reset 'X' Close back to Hamburger Bars"]
    
    OpenMenu --> UserSelectLink["User Clicks Menu Link (e.g. #branches, #products)"]
    UserSelectLink --> SmoothScroll["Smooth Scroll to View Target"]
    UserSelectLink --> CloseMenu
```

---

## 🔐 5. Admin Authentication & Lead Processing Lifecycle Flow

```mermaid
flowchart TD
    AdminUser(["Admin / Sales Staff"]) --> AccessPortal["Access /admin/index.html"]
    
    AccessPortal --> CheckToken{"JWT Token Present in localStorage?"}
    
    CheckToken -->|"No"| ShowLogin["Render Admin Login Form"]
    ShowLogin --> SubmitAuth["Enter Email & Password -> Click Login"]
    SubmitAuth --> AuthAPI["POST /api/auth/login"]
    
    AuthAPI -->|"Invalid Credentials"| ShowError["Display Auth Error Toast"]
    ShowError --> ShowLogin
    
    AuthAPI -->|"200 OK (Token Returned)"| SaveToken["Store JWT in localStorage"]
    SaveToken --> LoadDashboard
    
    CheckToken -->|"Yes"| LoadDashboard["Render Admin Dashboard Interface"]
    
    LoadDashboard --> FetchLeads["GET /api/inquiries (Auth Header Attached)"]
    FetchLeads --> PopulateTable["Render Leads & Quote Inquiries Data Table"]
    
    PopulateTable --> AdminAction{"Admin Action Choice"}
    
    AdminAction -->|"Update Status"| ChangeStatus["Select Status Dropdown (pending -> contacted -> quote_sent -> closed)"]
    ChangeStatus --> PutStatus["PUT /api/inquiries/:id/status"]
    PutStatus --> RefreshTable["Re-render Table & Update Metric Badges"]
    
    AdminAction -->|"Add / Edit Product"| OpenProdModal["Manage Product Inventory Form"]
    OpenProdModal --> PostProduct["POST / PUT /api/products"]
    PostProduct --> RefreshTable
    
    AdminAction -->|"Logout"| ClearToken["Remove JWT Token from localStorage"]
    ClearToken --> ShowLogin
```

---

## ⚡ 6. End-to-End REST API Request-Response Lifecycle Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend / Admin Client
    participant Helmet as Express Helmet & CORS Security
    participant Auth as JWT Auth Middleware
    participant Router as Express Domain Router
    participant Ctrl as API Controller
    participant Mongoose as Mongoose ODM
    participant DB as MongoDB Database

    Client->>Helmet: HTTP Request (e.g., PUT /api/inquiries/123/status)
    Helmet->>Auth: Pass secured & parsed request headers
    Auth->>Auth: Verify JWT Signature (Bearer token)
    alt Invalid / Expired Token
        Auth-->>Client: 401 Unauthorized Response
    else Valid Token
        Auth->>Router: Pass request with req.user attached
        Router->>Ctrl: Route to controller function (updateInquiryStatus)
        Ctrl->>Mongoose: Inquiry.findByIdAndUpdate(id, { status })
        Mongoose->>DB: Execute Update Query
        DB-->>Mongoose: Return Updated Document
        Mongoose-->>Ctrl: Document Object
        Ctrl-->>Client: 200 OK Response { success: true, data: inquiry }
    end
```
