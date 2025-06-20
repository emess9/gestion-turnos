    import React from 'react';
    import { Routes, Route } from 'react-router-dom';
    import { Toaster } from 'react-hot-toast'; // LIBRERIA Toaster cambia los alerts por algo mas visual

    import Navbar from './components/Navbar';
    import AdminRoute from './components/AdminRoute';
    import ProtectedRoute from './components/ProtectedRoute';
    import HomePage from './pages/HomePage';
    import LoginPage from './pages/LoginPage';
    import RegisterPage from './pages/RegisterPage';
    import AdminDashboard from './pages/AdminDashboard';
    import MyAppointmentsPage from './pages/MyAppointmentsPage';


    function App() {
      return (
        <>
          {/* Componente Toaster */}
          <Toaster 
            position="top-right"
            toastOptions={{
              success: {
                className: 'toast-success',
              },
              error: {
                className: 'toast-error',
              },
            }}
          />

          <Navbar />
          
          <main className="main-content">
            <Routes>
              {}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/my-appointments" element={<MyAppointmentsPage />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
              </Route>
            </Routes>
          </main>
        </>
      );
    }

    export default App;
    