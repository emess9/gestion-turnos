import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyAppointments } from '../services/appointmentService';
import './MyAppointmentsPage.css'; 

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const MyAppointmentsPage = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getMyAppointments(token);
        setAppointments(data);
      } catch (err) {
        setError('No se pudieron cargar tus turnos.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [token]);

  if (loading) {
    return <div className="appointments-container"><p>Cargando tus turnos...</p></div>;
  }

  if (error) {
    return <div className="appointments-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="appointments-container">
      <h2>Mis Turnos</h2>
      {appointments.length > 0 ? (
        <ul className="appointments-list">
          {appointments.map((app) => (
            <li key={app._id} className={`appointment-item status-${app.estado}`}>
              <div className="appointment-date">{formatDate(app.fecha)}</div>
              <div className="appointment-time">{app.horaInicio}</div>
              <div className="appointment-status">{app.estado}</div>
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

