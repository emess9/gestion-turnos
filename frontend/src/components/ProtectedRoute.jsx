import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente protege rutas. Si no estás logueado, te manda a la página de inicio de sesión.
const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth(); 

  // Si 'isLoggedIn' es verdadero, mostramos el componente que está dentro de esta ruta (<Outlet />).
  // Si no, lo mandamos a la página de login con <Navigate>.
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;