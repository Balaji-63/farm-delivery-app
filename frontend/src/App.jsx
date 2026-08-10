import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Day 2 Storefront Components
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';

// Day 3 Product & Cart Components
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

// Day 4 Checkout & Order Components
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// Day 5 Order Management Components
import MyOrders from './pages/MyOrders';
import OrderDetailsPage from './pages/OrderDetailsPage';

// Day 6 Admin Components
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers'; 

// Day 7 Delivery Components
import AdminDelivery from './pages/admin/AdminDelivery';
import DeliveryLayout from './layouts/DeliveryLayout'; 
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'; 
import DeliveryOrders from './pages/delivery/DeliveryOrders'; // 🔥 NEW: Imported Delivery Orders

// 1. Keeps logged-out users OUT of the private pages
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// 2. Keeps logged-in users OUT of the login/register screens
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Redirect directly to the new Storefront Home when logged in
  if (token) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-50 overflow-hidden relative">
        <Routes>
          {/* Default entry point now redirects to the main storefront */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* ==========================================
              AUTHENTICATION ROUTES
             ========================================== */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* ==========================================
              DAY 2 & 3: CORE STOREFRONT ROUTES
             ========================================== */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/category/:id" element={
            <ProtectedRoute>
              <CategoryView />
            </ProtectedRoute>
          } />

          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          } />

          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />

          {/* ==========================================
              DAY 4: CHECKOUT ROUTES
             ========================================== */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          <Route path="/order-success/:orderId" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />

          {/* ==========================================
              DAY 5: ORDER MANAGEMENT ROUTES
             ========================================== */}
          <Route path="/my-orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />

          <Route path="/my-orders/:orderId" element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />

          {/* ==========================================
              USER MANAGEMENT ROUTES
             ========================================== */}
          <Route path="/customer/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* ==========================================
              DAY 6 & 7: ADMIN DASHBOARD ROUTES
             ========================================== */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* The index route for /admin redirects to dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Core Admin Pages */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            
            <Route path="delivery" element={<AdminDelivery />} />
          </Route>

          {/* ==========================================
              DAY 7: DELIVERY PARTNER ROUTES
             ========================================== */}
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DeliveryDashboard />} />
            
            {/* 🔥 NEW: Delivery Orders Route */}
            <Route path="orders" element={<DeliveryOrders />} /> 
            
            {/* Future routes for history and profile will go here */}
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;