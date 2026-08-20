### 2. PROJECT_DOCUMENTATION.md
Create a file named `PROJECT_DOCUMENTATION.md` and paste this comprehensive system overview:

# Comprehensive Project Documentation

## 1. System Purpose
The Village Fresh Farm Delivery Platform bridges the gap between rural agriculture and urban consumers. By digitizing the supply chain, the platform ensures fresh produce delivery while providing a transparent, tracked workflow from order placement to final delivery.

## 2. Core Modules

### 2.1 Customer Module
*   **Authentication:** Secure JWT-based registration and login.
*   **Storefront:** Dynamic rendering of categories and farm-fresh products.
*   **Cart & Checkout:** Persistent cart management and secure order placement.
*   **Order Management:** Viewing order history (Delivered/Cancelled) with one-click reordering.
*   **Live Tracking:** Visual timeline detailing order statuses (Placed, Picked Up, Out for Delivery, Delivered) and ETA.

### 2.2 Admin Control Center
*   **Dashboard:** High-level metrics (Total Revenue, Active Orders, Delivered Orders).
*   **Inventory Management:** CRUD operations for Categories and Products.
*   **Order Fulfillment:** Centralized view to update order statuses and assign specific drivers.
*   **Delivery Partner Management:** Onboarding and toggling active/inactive status of delivery staff.

### 2.3 Delivery Partner Portal
*   **Driver Dashboard:** Daily metrics showing pending vs. completed deliveries.
*   **Task Management:** Card-based UI to view assigned orders, customer addresses, and contact numbers.
*   **Status Dispatch:** Button-driven workflow updating the database in real-time (Accept -> Picked Up -> Out for Delivery -> Delivered).

## 3. Folder Architecture

### Frontend Architecture
text
frontend/
├── src/
│   ├── assets/         # Static images and icons
│   ├── components/     # Reusable UI elements (Buttons, Navbars, Cards)
│   ├── layouts/        # Layout wrappers (AdminLayout, DeliveryLayout)
│   ├── pages/          # Full page views 
│   │   ├── admin/      # Admin module pages
│   │   ├── delivery/   # Driver module pages
│   │   └── ...         # Customer storefront pages
│   ├── App.jsx         # Main router configuration
│   └── main.jsx        # React entry point

### Backend Architecture
backend/
├── routers/            # API Route definitions
│   ├── admin.py
│   ├── auth.py
│   ├── cart.py
│   ├── checkout.py
│   ├── delivery.py
│   ├── storefront.py
│   └── tracking.py
├── database.py         # SQLAlchemy engine and session management
├── models.py           # MySQL Table schemas
├── schemas.py          # Pydantic models for request/response validation
└── main.py             # FastAPI application instance and CORS config