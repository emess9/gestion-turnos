import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Peluquería
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Inicio
            </Link>
          </li>
          
          {isLoggedIn ? (
            // Si el usuario ESTÁ logueado
            <>
              {}
              {/* Mostrar enlace al Dashboard solo si el usuario es admin */}
              {user.rol === 'admin' && (
                <li className="nav-item">
                  <Link to="/admin/dashboard" className="nav-links">
                    Dashboard
                  </Link>
                </li>
              )}
              {}

              <li className="nav-item">
                <span className="nav-links nav-user">Hola, {user.nombre}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-links nav-logout-btn">
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            // Si el usuario NO ESTÁ logueado
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Iniciar Sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
