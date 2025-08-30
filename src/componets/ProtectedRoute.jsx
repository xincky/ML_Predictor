// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');

  // Si hay un token, permite el acceso a la ruta. Si no, redirige al login.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;