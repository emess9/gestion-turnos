import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

// Solo permite el acceso si el usuario es un administrador.
const AdminRoute = () => {
  const { user, isLoggedIn } = useAuth(); 

  // Si el usuario está logueado Y tiene el rol de 'admin',
  // permitimos que acceda a la ruta que está intentando visitar.
  // <Outlet /> carga el componente que está anidado en esta ruta (por ejemplo, el Dashboard de Admin).
  if (isLoggedIn && user?.rol === 'admin') {
    return <Outlet />;
  }

  // Si no hay un usuario logueado, lo enviamos directamente a la página de login.
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  // Si el usuario está logueado, pero su rol NO es 'admin',
  // lo mandamos de vuelta a la página principal para denegar el acceso.
  return <Navigate to="/" />;
};

export default AdminRoute;