import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// Vamos a crear una nueva función en nuestro servicio de API
import { generateAppointmentsForDay } from '../services/appointmentService'; 
import './GenerateAppointments.css'; // Crearemos este archivo para los estilos

const GenerateAppointments = () => {
  // Estado para la fecha seleccionada y para los mensajes
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { token } = useAuth(); // Necesitamos el token del admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setError('Por favor, selecciona una fecha.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await generateAppointmentsForDay(selectedDate, token);
      setMessage(response.message);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al generar los turnos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-container">
      <h3>Generar Turnos para un Día</h3>
      <form onSubmit={handleSubmit} className="generate-form">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generando...' : 'Generar Turnos'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default GenerateAppointments;
