// La URL base de nuestra API de turnos
const API_URL = '/api/appointments';

/**
 * Obtiene los turnos para una fecha específica.
 * @param {string} date - La fecha en formato 'YYYY-MM-DD'.
 * @returns {Promise<Array>} - Una promesa que resuelve a un array de turnos.
 * @throws {Error} - Lanza un error si la petición falla.
 */
export const getAppointmentsByDate = async (date) => {
  const response = await fetch(`${API_URL}?date=${date}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener los turnos.');
  }
  
  return response.json();
};

/**
 * Reserva un turno para el usuario autenticado.
 * @param {string} appointmentId - El ID del turno a reservar.
 * @param {string} token - El token JWT del usuario.
 * @returns {Promise<object>} - Una promesa que resuelve al objeto del turno actualizado.
 * @throws {Error} - Lanza un error si la petición falla.
 */
export const bookAppointment = async (appointmentId, token) => {
  const response = await fetch(`${API_URL}/book/${appointmentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`, // Enviamos el token para la autenticación
      'Content-Type': 'application/json',
    },
    // No se necesita body para esta petición PUT
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al reservar el turno.');
  }

  return data;
};
