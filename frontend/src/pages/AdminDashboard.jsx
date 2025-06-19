import React from 'react';
import GenerateAppointments from '../components/GenerateAppointments'; // Componente para generar turnos
import ServiceManager from '../components/ServiceManager'; 

const AdminDashboard = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h1>Panel de Administrador</h1>
      <p>Bienvenido. Desde aquí podrás gestionar la configuración de la peluquería.</p>
      
      <hr style={{ margin: '2rem 0' }} />

      {/* Componente para generar los turnos disponibles */}
      <GenerateAppointments />

      <hr style={{ margin: '2rem 0' }} />

      {/* 2. Añadir el componente para gestionar los servicios */}
      <ServiceManager />

    </div>
  );
};

export default AdminDashboard;
