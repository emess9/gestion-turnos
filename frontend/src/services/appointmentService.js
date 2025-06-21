const API_URL = '/api/appointments';

export const getAppointmentsByDate = async (date) => {
  const response = await fetch(`${API_URL}?date=${date}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener los turnos.');
  }
  
  return response.json();
};


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

export const generateAppointmentsForDay = async (date, token) => {
  const response = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al generar los turnos.');
  }

  return data;
};

// cancelar turnos 

export const cancelAppointment = async (appointmentId, token) => {
  const response = await fetch(`${API_URL}/cancel/${appointmentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al cancelar el turno.');
  }

  return data;
};

// obtener turnos de un usuario

export const getMyAppointments = async (token) => {
  const response = await fetch(`${API_URL}/my-appointments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener mis turnos.');
  }

  return response.json();
};