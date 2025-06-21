import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  // Si el usuario está logueado, permite el acceso a la ruta hija (<Outlet />).
  // Si no, lo redirige a la página de login.
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
