import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (isAuthenticated && isAdmin) {
    return children;
  }

  toast.error('Unauthorized: admin access only', { autoClose: 2500 });
  return <Navigate to="/" state={{ from: location }} replace />;
}
