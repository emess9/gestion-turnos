import React, { createContext, useState, useContext } from 'react';

// 1. Creamos el Contexto
const AuthContext = createContext(null);

// 2. Creamos el Proveedor del Contexto (AuthProvider)
// Este componente envolverá nuestra aplicación y proveerá el estado.
export const AuthProvider = ({ children }) => {
  // Estado para guardar la información del usuario (incluyendo el token)
  // Intentamos recuperar la información del usuario del localStorage al iniciar.
  // Esto permite que la sesión persista si el usuario recarga la página.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error al parsear usuario desde localStorage", error);
      return null;
    }
  });

  // Función para iniciar sesión
  const login = (userData) => {
    // Guardamos la información del usuario en el estado
    setUser(userData);
    // Guardamos la información del usuario en localStorage para persistir la sesión
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiamos el estado
    setUser(null);
    // Limpiamos el localStorage
    localStorage.removeItem('user');
  };

  // El valor que será accesible por los componentes hijos
  const value = {
    user,      // El objeto del usuario (o null si no está logueado)
    token: user?.token, // Acceso fácil al token
    isLoggedIn: !!user, // Un booleano para saber si está logueado
    login,     // La función para hacer login
    logout,    // La función para hacer logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Creamos un Hook personalizado para usar el contexto más fácilmente
// En lugar de importar useContext y AuthContext en cada componente,
// solo importaremos useAuth.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
