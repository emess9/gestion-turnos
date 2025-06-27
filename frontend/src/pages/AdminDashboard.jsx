
import GenerateAppointments from '../components/GenerateAppointments'; // Componente para generar turnos
import ServiceManager from '../components/ServiceManager'; // componente para gestionar los servicios

const AdminDashboard = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h1>Panel de Administrador</h1>
      <p>Bienvenido. Desde aquí podrás gestionar la configuración de la peluquería.</p>
      
      <hr style={{ margin: '2rem 0' }} />

      <GenerateAppointments />

      <hr style={{ margin: '2rem 0' }} />

      <ServiceManager />

    </div>
  );
};

export default AdminDashboard;
