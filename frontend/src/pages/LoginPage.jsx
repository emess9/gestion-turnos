import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import './Form.css'; // Importamos los estilos del formulario

const LoginPage = () => {
  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para manejar la carga y los errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hooks para la navegación y el contexto de autenticación
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtenemos la función login de nuestro contexto

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenimos que el formulario recargue la página
    setLoading(true);   // Empezamos la carga
    setError(null);     // Limpiamos errores previos

    try {
      // 1. Llamamos a la función de nuestro servicio de API
      const userData = await loginUser(email, password);
      
      // 2. Si tiene éxito, llamamos a la función login de nuestro AuthContext
      login(userData);
      
      // 3. Redirigimos al usuario a la página de inicio
      navigate('/');

    } catch (err) {
      // Si el servicio lanza un error, lo capturamos
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      // 4. Terminamos la carga, tanto si hubo éxito como si hubo error
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
            disabled={loading}
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
