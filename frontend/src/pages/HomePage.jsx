import React, { useState, useEffect } from 'react';
import { getAppointmentsByDate, bookAppointment } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import './HomePage.css'; // Importamos los nuevos estilos

// Función helper para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Función helper para formatear la fecha a DD/MM/YYYY (formato argentino)
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};


const HomePage = () => {
  const { user, token, isLoggedIn } = useAuth(); // Obtenemos el usuario y el token del contexto

  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para cargar los turnos
  const fetchAppointments = async (date) => {
    setLoading(true);
    setError('');
    try {
      const data = await getAppointmentsByDate(date);
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los turnos.');
      setAppointments([]); // Limpiamos los turnos si hay un error
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los turnos cuando la página carga o la fecha cambia
  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]); // Se ejecuta cada vez que 'selectedDate' cambia

  // Función para manejar la reserva de un turno
  const handleBookAppointment = async (appointmentId) => {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para reservar un turno.');
      return;
    }

    const confirmBooking = window.confirm('¿Estás seguro de que quieres reservar este turno?');
    if (!confirmBooking) {
      return;
    }

    try {
      await bookAppointment(appointmentId, token);
      alert('¡Turno reservado con éxito!');
      // Volvemos a cargar los turnos para reflejar el cambio de estado
      fetchAppointments(selectedDate);
    } catch (err) {
      alert(`Error al reservar el turno: ${err.message}`);
    }
  };

  return (
    <div className="home-container">
      <h2>Reservar Turno</h2>
      <p>Selecciona una fecha para ver los turnos disponibles.</p>
      
      <div className="date-picker-container">
        <label htmlFor="date-picker">Elige una fecha:</label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {loading && <p className="loading-message">Cargando turnos...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <>
            <h3>Turnos para el {formatDate(selectedDate)}</h3>
            {appointments.length > 0 ? (
                <div className="appointments-grid">
                    {appointments.map((app) => (
                    <div key={app._id} className="appointment-card">
                        <h3>{app.horaInicio}</h3>
                        <p className={app.estado === 'disponible' ? 'status-disponible' : 'status-reservado'}>
                        {app.estado.charAt(0).toUpperCase() + app.estado.slice(1)}
                        </p>
                        {app.estado === 'disponible' && isLoggedIn && (
                        <button
                            className="book-btn"
                            onClick={() => handleBookAppointment(app._id)}
                        >
                            Reservar
                        </button>
                        )}
                    </div>
                    ))}
                </div>
            ) : (
                <p>No hay turnos generados para este día. Por favor, selecciona otra fecha.</p>
            )}
        </>
      )}
    </div>
  );
};

export default HomePage;
