# Village Fresh - Project Documentation

## Project Overview
Village Fresh is a full-stack e-commerce platform designed to facilitate the delivery of farm-fresh products directly to consumers. The application is divided into two main experiences: a consumer-facing storefront for browsing and purchasing products, and a secure administrative dashboard for managing business operations.

## Technology Stack
*   **Frontend:** React.js (via Vite), React Router DOM, Tailwind CSS
*   **Backend:** FastAPI (Python)
*   **Database ORM:** SQLAlchemy
*   **API Communication:** Axios
*   **Icons:** Lucide React

------------------------------------------------------------------------------------------------

## Application Modules
The application was developed in structured phases, resulting in the following core modules:

*   **Authentication:** Secure login and registration flows for users.
*   **Storefront (Days 2 & 3):** Product catalog, category browsing, individual product detail pages, and a shopping cart system.
*   **Checkout & Fulfillment (Days 4 & 5):** Order placement, success confirmation, and customer-facing order history and tracking.
*   **Admin Control Center (Day 6):** Comprehensive backend management system with specialized layouts and protected routing.

------------------------------------------------------------------------------------------------

## Database Schema (models.py)
The relational database is structured using SQLAlchemy with the following core entities:

| Table Name | Primary Key | Key Relationships & Fields | Purpose |

| **customers** | id (Integer) | customer_id, mobile_number, status | Stores registered users and their account status. |
| **categories** | id (Integer) | One-to-Many with Products | Organizes inventory into distinct product groups. |
| **products** | id (Integer) | category_id , price, stock | Stores individual item details, pricing, and inventory. |
| **cart** | id (Integer) | customer_id, product_id | Manages active shopping cart sessions. |
| **customer_addresses** | id (Integer) | customer_id, is_default | Stores delivery locations for checkout. |
| **orders** | order_id (String) | customer_id, order_status | The central record for a customer purchase. |
| **order_items** | id (Integer) | order_id, product_id | Line items detailing exactly what was purchased. |
| **order_status_history**| id (Integer) | order_id | Tracks the timeline of an order (e.g., Pending to Delivered). |

------------------------------------------------------------------------------------------------

## Backend API Architecture (admin.py)
The FastAPI backend exposes the following RESTful endpoints for the Admin Dashboard:

| Endpoint | HTTP Method | Action |

| /api/admin/dashboard-summary | GET | Aggregates total metrics (revenue, orders, customers). |
| /api/admin/categories | GET, POST | Fetches all categories or creates a new one. |
| /api/admin/categories/{id} | PUT, DELETE | Updates or removes a specific category. |
| /api/admin/products | GET, POST | Fetches all products or creates a new one. |
| /api/admin/products/{id} | PUT, DELETE | Updates or removes a specific product. |
| /api/admin/orders | GET | Retrieves all customer orders, sorted by newest. |
| /api/admin/orders/{order_id}/status | PUT | Updates order status and assigns delivery partners. |
| /api/admin/customers | GET | Retrieves the directory of all registered customers. |
| /api/admin/customers/{id}/status | PUT | Toggles customer account access (Active/Inactive). |

------------------------------------------------------------------------------------------------

## Frontend Routing Hierarchy (App.jsx)
The React frontend utilizes a strict routing hierarchy to manage access control across the platform.

### Public Routes
Accessible to unauthenticated users, automatically redirecting logged-in users away from these pages:
*   /login - User authentication
*   /register - New account creation

### Protected Consumer Routes
Require a valid JWT token in local storage; otherwise, the user is redirected to the login page:
*   /home - Main storefront
*   /category/:id - Filtered product view
*   /product/:id - Product details
*   /cart - Active shopping cart
*   /checkout - Payment and address selection
*   /order-success/:orderId - Confirmation screen
*   /my-orders - Customer's order history
*   /my-orders/:orderId - Detailed view of a past order
*   /customer/dashboard - User profile management

### Admin Protected Routes
Nested underneath the /admin path and rendered inside the AdminLayout wrapper component:
*   /admin/dashboard - Analytics and metrics overview
*   /admin/categories - Category management table and forms
*   /admin/products - Product inventory management
*   /admin/orders - Order fulfillment and driver assignment
*   /admin/customers - User directory and access control