import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Day 2 Storefront Components
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';

// 🔥 NEW: Day 3 Product & Cart Components
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

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

          {/* 🔥 NEW: Product Details Route */}
          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          } />

          {/* 🔥 NEW: Shopping Cart Route */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;