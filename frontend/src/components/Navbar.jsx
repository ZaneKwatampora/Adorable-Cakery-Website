// Navbar.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaUserCircle,
  FaShoppingCart,
  FaTimes,
  FaSignOutAlt,
  FaSignInAlt,
  FaHome,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import CartIcon from './CartIcon';

export default function Navbar() {
  const { pathname } = useLocation();
  const { logoutUser, isAuthenticated, isAdmin, user } = useContext(AuthContext);
  const dashboardLink = isAdmin ? "/admin" : "/dashboard";

  const [open, setOpen] = useState(false);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    setOpen(false); // Close sidebar on route change
  }, [pathname]);

  const handleDocumentClick = (e) => {
    if (toggleButtonRef.current && toggleButtonRef.current.contains(e.target)) {
      setOpen(prev => !prev);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  if (pathname.startsWith("/auth")) return null;

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Sidebar Toggle with custom tooltip */}
          <div className="relative group">
            <button ref={toggleButtonRef} className="text-3xl text-gray-800 hover:text-pink-400">
              <FaBars />
            </button>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-pink-500 text-white text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap">
              Menu
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex gap-6 text-2xl text-gray-800">
            {/* Home icon with custom tooltip */}
            <div className="relative group">
              <Link to="/" className="hover:text-pink-400 pt-1">
                <FaHome />
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-pink-500 text-white text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap">
                Home
              </div>
            </div>

            {isAuthenticated && (
              <>
                {/* Dashboard icon with tooltip */}
                <div className="relative group">
                  <Link to={dashboardLink} className="hover:text-pink-400 pt-1">
                    <FaUserCircle />
                  </Link>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-pink-500 text-white text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap">
                    Dashboard
                  </div>
                </div>

                <CartIcon />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="fixed top-0 left-0 h-full w-72 z-50 bg-black/60 backdrop-blur-md shadow-2xl border-r border-pink-500 flex flex-col"
            >
              {/* TOP SECTION */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-pink-300 drop-shadow-md">
                    {isAuthenticated
                      ? `Welcome, ${user?.full_name?.split(' ')[0]}! 🍰`
                      : 'Welcome to Adorable Cakery 🍰'}
                  </h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-3xl text-gray-300 hover:text-pink-400 transition"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* NAV LINKS (TOOLTIPS REMOVED HERE) */}
                <nav className="flex flex-col gap-4 text-white text-base">
                  {[
                    { to: "/treats", icon: "🍬", label: "Treats" },
                    { to: "/about", icon: "🎂", label: "About" },
                    { to: "/gallery", icon: "🖼️", label: "Gallery" },
                    ...(isAuthenticated ? [{
                      to: dashboardLink,
                      icon: <FaUserCircle className="text-lg" />,
                      label: "Dashboard"
                    }] : [])
                  ].map(({ to, icon, label }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-pink-500/20 hover:text-pink-300 transition"
                    >
                      {typeof icon === 'string' ? <span>{icon}</span> : icon}
                      <span>{label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* BOTTOM SECTION */}
              <div className="mt-auto p-6 border-t border-pink-500">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logoutUser();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-pink-400 hover:text-white hover:bg-pink-500/20 transition w-full"
                  >
                    <FaSignOutAlt /> <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    onClick={() => setOpen(false)}
                    to="/auth"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-pink-400 hover:text-white hover:bg-pink-500/20 transition w-full"
                  >
                    <FaSignInAlt /> <span>Log In</span>
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
