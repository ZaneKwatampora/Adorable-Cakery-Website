import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';


import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout';
import Conact from './pages/Conact';
import About from './pages/About';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/treats" element={<Products />} />
            <Route path="/auth" element={<Auth />} />

            {/* user pages */}
            <Route path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            {/* admin-only */}
            <Route path="/admin"
              element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* fallback demo pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Conact />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path='/checkout' element={<Checkout />} />
          </Routes>
          <Footer />
          {/* global toasts */}
          <ToastContainer position="top-left" newestOnTop />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
