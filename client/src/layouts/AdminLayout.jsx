import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Profile from '../pages/Profile';

const AdminLayout = () => {
  const [showProfile, setShowProfile] = useState(true);
  const location = useLocation();
  const navRef = useRef();

  const navItems = [
    { label: 'Overview', action: () => setShowProfile(true), isButton: true },
    { path: '/dashboard/category', label: 'Manage Categories' },
    { path: '/dashboard/subcategory', label: 'Manage Subcategories' },
    { path: '/dashboard/upload-product', label: 'Upload Product' },
    { path: '/dashboard/product', label: 'All Products' },
    { path: '/dashboard/myorders', label: 'Customer Orders' },
    { path: '/dashboard/address', label: 'Earning Report' },
    { path: '/dashboard/admin-stock-manager', label: 'Stock Manager' },
    { path: '/dashboard/admin-user-verification', label: 'User Verification' },
    { path: '/dashboard/verified-users', label: 'Verified Users' },
    { path: '/dashboard/BannerUploadPage', label: 'BannerUpload' }
  ];

  useEffect(() => {
    if (!location.pathname.includes('overview')) {
      setShowProfile(false);
    }
  }, [location]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#1abc9c] text-gray-400">
      <div className="container mx-auto p-5">

        {/* Header */}
        <motion.header
          className="flex justify-between items-center p-4 mb-8 rounded-xl bg-white/20 shadow-xl backdrop-blur-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-yellow-400">⚙️ Admin Dashboard</h1>
          <p className="text-sm text-gray-300">Manage Everything Smoothly 🚀</p>
        </motion.header>

        {/* Navigation with fade edges */}
        <div className="relative nav-scroll-container mb-8">
          {/* Fade Left & Right */}
          <div className="nav-fade-left"></div>
          <div className="nav-fade-right"></div>

          <motion.nav
            ref={navRef}
            className="flex overflow-x-auto whitespace-nowrap gap-3 px-2 hide-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {navItems.map((item, i) => {
              if (item.isButton) {
                return (
                  <motion.button
                    key={i}
                    onClick={item.action}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      showProfile
                        ? 'bg-gradient-to-r from-[#ff9e00] to-[#f39c12] text-white shadow-lg scale-105'
                        : 'bg-[#34495e] text-gray-200 hover:bg-[#f39c12] hover:scale-105'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.button>
                );
              } else {
                return (
                  <NavLink
                    key={i}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#ff9e00] to-[#e1d9cc] text-white shadow-lg scale-105'
                          : 'bg-[#34495e] text-gray-400 hover:bg-[#f39c12] hover:scale-105'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              }
            })}
          </motion.nav>
        </div>

        {/* Main Content */}
        <motion.div
          className="bg-[#2c3e50] p-6 rounded-2xl shadow-inner border border-white/20 min-h-[70vh]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 80 }}
        >
          {showProfile ? <Profile /> : <Outlet />}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="text-center text-gray-400 text-xs mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          © 2025 Admin Dashboard — Designed by Rajesh 💻✨
        </motion.footer>

      </div>
    </section>
  );
};

export default AdminLayout;
