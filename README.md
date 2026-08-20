# Village Fresh – Farm Delivery Platform 

Village Fresh is a full-stack, farm-to-doorstep e-commerce and delivery platform. It connects local farmers directly with consumers, allowing customers to browse fresh produce, place orders, and track deliveries in real-time. It includes a comprehensive Admin panel for inventory and dispatch management, and a dedicated portal for Delivery Partners to manage their routes.

##  Tech Stack

*   **Frontend:** React JS (Vite), Tailwind CSS, Lucide React (Icons), React Router DOM
*   **Backend:** Python 3, FastAPI, SQLAlchemy, JWT Authentication
*   **Database:** MySQL
*   **Architecture:** RESTful APIs, Client-Server Model

##  Project Structure

The project is divided into two main directories:
*   /frontend - Contains the Vite React application.
*   /backend - Contains the FastAPI Python application.

##  Local Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   MySQL Server (Running locally on port 3306)

### 1. Database Setup
Create a new MySQL database named farm_delivery:
sql
CREATE DATABASE farm_delivery;

2. Backend Setup
Navigate to the backend directory, install dependencies, and run the server.

cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --reload

The backend will be available at http://localhost:8000

3. Frontend Setup
Navigate to the frontend directory, install dependencies, and run the development server.

cd frontend
npm install
npm run dev

The frontend will be available at http://localhost:5173

### User Roles & Access
Customer: Can browse products, add to cart, checkout, and track orders.

Admin: Can manage products, categories, orders, and assign delivery partners.

Delivery Partner: Can view assigned routes, accept deliveries, and update statuses to "Delivered".