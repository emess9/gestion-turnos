// La URL base de nuestra API, gracias al proxy de Vite,
// solo necesitamos usar la ruta relativa.
const API_URL = '/api/auth';

/**
 * Llama al endpoint de login del backend.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<object>} - La promesa que resuelve al objeto del usuario con el token.
 * @throws {Error} - Lanza un error si las credenciales son inválidas o hay un error de servidor.
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Si la respuesta no es 2xx, lanzamos un error con el mensaje del backend.
    throw new Error(data.message || 'Error al iniciar sesión.');
  }

  // Si la respuesta es exitosa, devolvemos los datos del usuario (incluyendo el token).
  return data;
};

// FUUNCIÓN REGISTRO USUARIOS

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al registrar el usuario.');
  }

  return data;
};


