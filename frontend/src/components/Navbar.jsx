import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaUserCircle,
  FaShoppingCart,
  FaTimes,
  FaSignOutAlt,
  FaSignInAlt,
  FaBirthdayCake,
  FaBell,
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
          {/* Sidebar Toggle */}
          <button ref={toggleButtonRef} className="text-3xl text-gray-800 hover:text-pink-400">
            <FaBars />
          </button>

          {/* Right Icons */}
          <div className="flex gap-6 text-2xl text-gray-800">
            <Link to="/" className='hover:text-pink-400 pt-1' title='Home'>
              <FaHome />
            </Link>
            {isAuthenticated && (
              <>
                <Link to={dashboardLink} className="hover:text-pink-400 pt-1" title="Dashboard">
                  <FaUserCircle />
                </Link>

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
              className="fixed top-0 left-0 h-full w-72 bg-black text-white z-50 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-pink-400">
                  {isAuthenticated
                    ? `Welcome, ${user?.full_name?.split(' ')[0]}! 🍰`
                    : 'Welcome to Adorable Cakery 🍰'}
                </h2>
                <button onClick={() => setOpen(false)} className="text-3xl text-gray-300 hover:text-pink-400">
                  <FaTimes />
                </button>
              </div>

              <nav className="flex flex-col gap-6 text-lg">
                <Link
                  onClick={() => setOpen(false)}
                  to="/treats"
                  className="hover:text-pink-400 flex items-center gap-3 transition-all duration-150 ease-in-out hover:translate-x-1"
                >
                  Treats
                </Link>

                {isAuthenticated && (
                  <>
                    <Link onClick={() => setOpen(false)} to={dashboardLink} className="hover:text-pink-400">
                      Dashboard
                    </Link>
                  </>
                )}

                <Link onClick={() => setOpen(false)} to="/about" className="hover:text-pink-400">
                  About
                </Link>
              </nav>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logoutUser();
                    setOpen(false);
                  }}
                  className="mt-auto flex items-center gap-3 text-pink-400 hover:text-white border-t border-pink-400 pt-5"
                >
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <Link
                  onClick={() => setOpen(false)}
                  to="/auth"
                  className="mt-auto flex items-center gap-3 text-pink-400 hover:text-white border-t border-pink-400 pt-5"
                >
                  <FaSignInAlt /> Log In
                </Link>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
