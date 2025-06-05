import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import loginImg    from '../assets/cake-login.jpg';
import registerImg from '../assets/cake-register.jpg';

export default function Auth() {
  /* ========== state ========== */
  const [isLogin, setIsLogin] = useState(true);

  const [loginForm, setLoginForm] = useState({ full_name: '', password: '' });
  const [regForm,   setRegForm]   = useState({
    full_name: '', password: '', email: '', phone: ''
  });

  const { loginUser } = useContext(AuthContext);
  const navigate      = useNavigate();

  /* ========== helpers ========== */
  const toggleForm = () => setIsLogin(p => !p);

  const bind = (state, set) => (field) => ({
    value: state[field],
    onChange: e => set(s => ({ ...s, [field]: e.target.value }))
  });

  const L = bind(loginForm, setLoginForm);
  const R = bind(regForm,   setRegForm);

  /* ========== actions ========== */
  const handleLogin = async e => {
    e.preventDefault();
    try {
      await loginUser(loginForm.full_name, loginForm.password);
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Wrong name or password';
      Swal.fire({ icon:'error', title:'Login failed', text: errorMsg });
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const username = regForm.full_name.replace(/\s+/g,'').toLowerCase() || regForm.email;
      await axios.post('/api/register/', { ...regForm, username });

      Swal.fire({
        icon:'success',
        title:'Almost done!',
        html:'Check inbox <b>and</b> spam for the confirmation email.',
        confirmButtonColor:'#e91e63'
      }).then(toggleForm);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration failed',
        text: err.response?.data?.error || 'Please try again'
      });
    }
  };

  /* ========== UI ========== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f0f5] px-4">
      <motion.div
        layout
        transition={{ duration: 0.6 }}
        className={`relative flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-white
                    ${isLogin ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
      >
        {/* IMAGE PANEL */}
        <motion.div layout className="md:w-1/2 h-64 md:h-auto shrink-0">
          <img
            src={isLogin ? loginImg : registerImg}
            alt="Adorable Cakery"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* FORM PANEL */}
        <motion.div layout className="md:w-1/2 w-full p-10 flex flex-col justify-center">
          {isLogin ? (
            <>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome Back</h2>

              <form onSubmit={handleLogin} className="space-y-5">
                <input {...L('full_name')} placeholder="Full Name"
                  className="w-full rounded-lg border px-4 py-3 focus:ring-pink-400" required />
                <input {...L('password')} placeholder="Password" type="password"
                  className="w-full rounded-lg border px-4 py-3 focus:ring-pink-400" required />
                <button className="w-full py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold">
                  Log In
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don’t have an account?&nbsp;
                <button onClick={toggleForm} className="text-pink-500 font-medium hover:underline">
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Create Account</h2>

              <form onSubmit={handleRegister} className="space-y-4">
                <input {...R('full_name')} placeholder="Full Name"
                  className="w-full rounded-lg border px-4 py-3 focus:ring-pink-400" required />
                <input {...R('email')} placeholder="Email Address" type="email"
                  className="w-full rounded-lg border px-4 py-3 focus:ring-pink-400" required />
                <input {...R('phone')} placeholder="Phone Number" type="tel"
                  className="w-full rounded-lg border px-4 py-3 focus:ring-pink-400" required />
                <input {...R('password')} placeholder="Password" type="password"
                  className="w-full rounded-lg border px-4 py-3 focus:ring-pink-400" required />
                <button className="w-full py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold">
                  Sign Up
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-700">
                Already have an account?&nbsp;
                <button onClick={toggleForm} className="text-pink-500 font-medium hover:underline">
                  Log in
                </button>
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
