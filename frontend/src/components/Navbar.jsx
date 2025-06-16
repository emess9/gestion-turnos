import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importar nuestro hook useAuth
import './Navbar.css';

const Navbar = () => {
  // 2. Obtener el estado y las funciones del contexto
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login'); // Redirige al usuario a la página de login
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
          
          {/* 3. Renderizado Condicional de los enlaces */}
          {isLoggedIn ? (
            // Si el usuario ESTÁ logueado
            <>
              {/* Podríamos añadir un enlace a su perfil o turnos aquí */}
              {/* <li className="nav-item">
                <Link to="/mis-turnos" className="nav-links">
                  Mis Turnos
                </Link>
              </li> */}
              <li className="nav-item">
                {/* Usamos un <span> para mostrar el nombre, no es un enlace */}
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
