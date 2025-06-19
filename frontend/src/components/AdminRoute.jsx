import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, isLoggedIn } = useAuth();

  // Si el usuario está logueado y su rol es 'admin', permite el acceso a la ruta hija.
  // <Outlet /> es el componente que representa a la página hija (ej. el Dashboard).
  if (isLoggedIn && user?.rol === 'admin') {
    return <Outlet />;
  }

  // Si no está logueado, redirige a la página de login.
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  // Si está logueado pero NO es admin, redirige a la página de inicio.
  return <Navigate to="/" />;
};

export default AdminRoute;
