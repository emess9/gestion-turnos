import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Importamos el hook para obtener el token del usuario.
import { getMyAppointments, cancelAppointment } from '../services/appointmentService'; // Funciones para obtener y cancelar turnos desde la API.
import './MyAppointmentsPage.css'; 

// Pequeña función para mostrar la fecha en formato día/mes/año.
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Este componente muestra la lista de todos los turnos que el usuario ha reservado.
const MyAppointmentsPage = () => {
  const { token } = useAuth(); 
  const [appointments, setAppointments] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 

  // Usamos useEffect para cargar los turnos del usuario la primera vez que se carga la página.
  useEffect(() => {
    // Función asíncrona para obtener los turnos desde el backend.
    const fetchAppointments = async () => {
      try {
        setLoading(true); 
        // Llamamos a la API para obtener los turnos del usuario actual, usando su token.
        const data = await getMyAppointments(token);
        setAppointments(data); // Guardamos la lista de turnos en el estado.
      } catch (err) {
        setError('No se pudieron cargar tus turnos.'); 
      } finally {
        setLoading(false); 
      }
    };

    // Solo buscamos los turnos si tenemos un token de autenticación.
    if (token) {
      fetchAppointments();
    }
  }, [token]); 

  // Función para manejar la cancelación de un turno.
  const handleCancel = async (appointmentId) => {
    try {
      // Llamamos a la función de la API para cancelar el turno por su ID.
      await cancelAppointment(appointmentId, token);
      // Actualizamos la lista de turnos en el estado, quitando el que se acaba de cancelar.
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
    } catch (err) {
      // Si la cancelación falla, mostramos una alerta.
      alert('Error al cancelar el turno.');
    }
  };

  // Si está cargando, mostramos un mensaje para que el usuario espere.
  if (loading) {
    return <div className="appointments-container"><p>Cargando tus turnos...</p></div>;
  }

  // Si hay un error, mostramos el mensaje de error.
  if (error) {
    return <div className="appointments-container"><p className="error-message">{error}</p></div>;
  }

  // Si no hay carga ni errores, mostramos la lista de turnos.
  return (
    <div className="appointments-container">
      <h2>Mis Turnos</h2>
      
      {appointments.length > 0 ? (
        <ul className="appointments-list">
          {/* Mapeamos cada turno para mostrarlo como un ítem de la lista. */}
          {appointments.map((app) => (
            <li key={app._id} className={`appointment-item status-${app.estado}`}>
              <div className="appointment-date">{formatDate(app.fecha)}</div>
              <div className="appointment-time">{app.horaInicio}</div>
              <div className="appointment-status">{app.estado}</div>

              {/* Si el turno está reservado, mostramos el botón de cancelar. */}
              {app.estado === 'reservado' && (
                <button
                  className="cancel-button"
                  onClick={() => handleCancel(app._id)} 
                >
                  Cancelar Turno
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes ningún turno reservado.</p>
      )}
    </div>
  );
};

export default MyAppointmentsPage;