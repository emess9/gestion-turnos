import React, { useState, useEffect } from 'react';
import { getAppointmentsByDate, bookAppointment } from '../services/appointmentService';
import { getServices } from '../services/serviceService'; 
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

const HomePage = () => {
  const { token, isLoggedIn } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]); // servicios
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
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  
  // 3. useEffect para cargar servicios y turnos al inicio
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const servicesData = await getServices();
            setServices(servicesData);
        } catch (error) {
            console.error("Error al cargar servicios:", error);
        }
    };
    
    fetchInitialData();
    fetchAppointments(selectedDate);
  }, [selectedDate]);

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
      fetchAppointments(selectedDate);
    } catch (err) {
      alert(`Error al reservar el turno: ${err.message}`);
    }
  };

  return (
    <div className="home-container">
      <div className="services-section">
        <h2>Nuestros Servicios</h2>
        {services.length > 0 ? (
          <ul className="services-list-home">
            {services.map(service => (
              <li key={service._id}>{service.nombre} - <span>{service.descripcion}</span></li>
            ))}
          </ul>
        ) : (
          <p>Cargando servicios...</p>
        )}
      </div>

      <hr style={{width: '80%', margin: '2rem auto'}} />

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
