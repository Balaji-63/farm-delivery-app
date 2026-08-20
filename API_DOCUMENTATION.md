### 5. API Documentation

# API Documentation

Base URL: http://localhost:8000

### 1. Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | /api/register | Register a new customer | No |
| POST | /api/login | Authenticate and retrieve JWT token | No |
| GET | /api/profil | Retrieve logged-in user profile | **Yes** |

### 2. Storefront & Products
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | /api/storefront/categories | Get all active categories | No |
| GET | /api/storefront/products/featured | Get featured/popular products | No |
| GET | /api/storefront/categories/{id}/products | Get products by category | No |
| GET | /api/storefront/products/{id} | Get specific product details | No |

### 3. Cart & Checkou
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | /api/cart | Get current user's cart | **Yes**
| POST | /api/cart | Add product to cart | **Yes** |
| DELETE | /api/cart/{id} | Remove item from cart | **Yes** |
| POST | /api/orders | Checkout and generate new Order | **Yes** |

### 4. Order Management & Tracking
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | /api/orders | Get current user's order history | **Yes** |
| GET | /api/orders/{id} | Get specific order details | **Yes** |
| GET | /api/tracking/{id} | Get live timeline and ETA for an order | **Yes** |

### 5. Admin Control Center
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | /api/admin/dashboard-summary | Get revenue and active order stats | **Yes** (Admin) |
| GET | /api/admin/orders | Get all platform orders | **Yes** (Admin) |
| PUT | /api/admin/orders/{id}/status | Update global order status | **Yes** (Admin) |
| GET | /api/admin/delivery-partners | List all delivery partners | **Yes** (Admin) |
| POST | /api/admin/delivery-partners | Onboard new delivery partner | **Yes** (Admin) |
| POST | /api/admin/delivery-assignments | Dispatch order to specific partner | **Yes** (Admin) |

### 6. Delivery Partner Module
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | /api/delivery/dashboard/{id} | Get partner's daily delivery stats | **Yes** (Driver) |
| GET | /api/delivery/assignments/{id} | View active assigned routes | **Yes** (Driver) |
| PUT | /api/delivery/assignments/{id}/status| Update status (Picked Up/Delivered) | **Yes** (Driver) |