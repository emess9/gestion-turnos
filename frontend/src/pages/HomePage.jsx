import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAppointmentsByDate, bookAppointment, cancelAppointment } from '../services/appointmentService';
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
  const { user, token, isLoggedIn } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- LÓGICA DE CARGA DE DATOS (CORREGIDA) ---
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

  useEffect(() => {
    const fetchInitialServices = async () => {
      try {
        const servicesData = await getServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        toast.error("No se pudieron cargar los servicios.");
      }
    };
    fetchInitialServices();
  }, []);

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  // --- LÓGICA DE RESERVA (CORREGIDA Y SIMPLIFICADA) ---
  const handleBookAppointment = (appointmentId) => {
    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para reservar un turno.');
      return;
    }

    toast((t) => (
      <span>
        ¿Reservar este turno?
        <button
          className="toast-confirm-btn"
          onClick={() => {
            const promise = bookAppointment(appointmentId, token).then(() => {
              // Si la promesa tiene éxito, actualizamos la lista
              fetchAppointments(selectedDate);
            });
            // Pasamos la promesa al gestor de toasts
            toast.promise(promise, {
              loading: 'Reservando...',
              success: '¡Turno reservado!',
              error: (err) => err.message || 'No se pudo reservar.',
            });
            toast.dismiss(t.id); // Cerramos el toast de confirmación
          }}
        >
          Sí
        </button>
        <button className="toast-cancel-btn" onClick={() => toast.dismiss(t.id)}>
          No
        </button>
      </span>
    ), { duration: 6000, style: { background: '#1d3557', color: 'white' } });
  };

  // --- LÓGICA DE CANCELACIÓN (CORREGIDA Y SIMPLIFICADA) ---
  const handleCancelAppointment = (appointmentId) => {
    toast((t) => (
      <span>
        ¿Cancelar tu reserva?
        <button
          className="toast-confirm-btn"
          onClick={() => {
            const promise = cancelAppointment(appointmentId, token).then(() => {
              fetchAppointments(selectedDate);
            });
            toast.promise(promise, {
              loading: 'Cancelando...',
              success: 'Reserva cancelada.',
              error: (err) => err.message || 'No se pudo cancelar.',
            });
            toast.dismiss(t.id);
          }}
        >
          Sí
        </button>
        <button className="toast-cancel-btn" onClick={() => toast.dismiss(t.id)}>
          No
        </button>
      </span>
    ), { duration: 6000, style: { background: '#1d3557', color: 'white' } });
  };


  return (
    <div className="home-container">
      {/* ... El resto del JSX no necesita cambios ... */}
      <div className="services-section">
        <h2>Nuestros Servicios</h2>
        {services.length > 0 ? (
          <ul className="services-list-home">
            {services.map(service => (
              <li key={service._id}>{service.nombre} - <span>{service.descripcion}</span></li>
            ))}
          </ul>
        ) : <p>Cargando servicios...</p>}
      </div>
      <hr style={{width: '80%', margin: '2rem auto'}} />
      <h2>Reservar Turno</h2>
      <div className="date-picker-container">
        <label htmlFor="date-picker">Elige una fecha:</label>
        <input type="date" id="date-picker" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
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
                          {app.estado === 'reservado' ? 'Reservado' : 'Disponible'}
                        </p>
                        {isLoggedIn && app.estado === 'disponible' && (
                          <button className="book-btn" onClick={() => handleBookAppointment(app._id)}>Reservar</button>
                        )}
                        {isLoggedIn && app.estado === 'reservado' && user?._id === app.clienteId && (
                          <button className="cancel-btn" onClick={() => handleCancelAppointment(app._id)}>Cancelar Reserva</button>
                        )}
                    </div>
                    ))}
                </div>
            ) : <p>No hay turnos generados para este día.</p>}
        </>
      )}
    </div>
  );
};

export default HomePage;
