const API_URL = '/api/services';

export const getServices = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener los servicios.');
  }

  return response.json();
};


export const createService = async (serviceData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al crear el servicio.');
  }

  return data;
};

// eliminar servicio
export const deleteService = async (serviceId, token) => {
  const response = await fetch(`${API_URL}/${serviceId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar el servicio.');
  }

  return data;
};

// editar un servicio

export const updateService = async (serviceId, serviceData, token) => {
  const response = await fetch(`${API_URL}/${serviceId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar el servicio.');
  }

  return data;
};



