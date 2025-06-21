// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// Middleware que verifica si el usuario está autenticado
const protect = async (req, res, next) => {
  let token;

  // Verifica si viene un token en el header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verifica el token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca al usuario en base al ID del token
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'No autorizado: usuario no encontrado.' });
      }

      next();
    } catch (error) {
      console.error('Error al validar token:', error.message);
      return res
        .status(401)
        .json({ message: 'Token inválido o expirado.' });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'No autorizado: token no enviado.' });
  }
};

// Middleware para verificar si el usuario autenticado es administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res
      .status(403)
      .json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

export { protect, isAdmin };
