import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importamos los componentes
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute'; 

// Importamos las páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard'; 

function App() {
  return (
    <>
      <Navbar />
      
      <main className="main-content">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Ruta de Administrador Protegida */}
          <Route path="/admin/dashboard" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} /> 
          </Route>

        </Routes>
      </main>
    </>
  );
}

export default App;

