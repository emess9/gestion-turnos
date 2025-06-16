import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importamos el componente Navbar
import Navbar from './components/Navbar';

// Importamos los componentes de nuestras páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <>
      {/* 1. La Navbar se coloca aquí, fuera de <Routes> */}
      <Navbar />
      
      {/* 2. Un contenedor principal para el contenido de la página */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
