import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/authService'; // Importamos la función de registro
import './Form.css'; // Reutilizamos los mismos estilos

const RegisterPage = () => {
  // Estado para los campos del formulario (añadimos 'nombre')
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para manejar la carga y los errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hooks para la navegación y el contexto de autenticación
  const navigate = useNavigate();
  const { login } = useAuth(); // También usaremos login para iniciar sesión automáticamente tras el registro

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Llamamos a la función de nuestro servicio de API con los datos del nuevo usuario
      const userData = await registerUser({ nombre, email, password });
      
      // 2. Si el registro tiene éxito, iniciamos sesión con los datos recibidos
      login(userData);
      
      // 3. Redirigimos al usuario a la página de inicio
      navigate('/');

    } catch (err) {
      // Capturamos cualquier error (ej. email ya existe) y lo mostramos
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6" 
            disabled={loading}
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </button>
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterPage;
