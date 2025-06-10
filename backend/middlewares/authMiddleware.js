const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); // Necesitamos el modelo User para buscar al usuario

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si el token existe en los headers y tiene el formato correcto
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Obtener el token del header (quitando la palabra 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Obtener el usuario a partir del ID en el token y adjuntarlo a req.user
      // Seleccionamos '-password' para excluir la contraseña del objeto usuario que adjuntamos
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        // Esto podría pasar si el usuario fue eliminado después de que el token fue emitido
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado.' });
      }

      // 5. Si todo es correcto, pasar al siguiente middleware o controlador de la ruta
      next();

    } catch (error) {
      console.error('Error al verificar el token:', error.message);
      // Si el token es inválido (ej. expiró, firma incorrecta), jwt.verify lanzará un error
      return res.status(401).json({ message: 'No autorizado, token falló o es inválido.' });
    }
  }

  // Si no hay token en los headers o no tiene el formato 'Bearer'
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se proporcionó token.' });
  }
};

// Middleware para verificar si el usuario tiene rol de 'admin'
// Este middleware DEBE usarse DESPUÉS del middleware 'protect'
const isAdmin = (req, res, next) => {
  // El middleware 'protect' ya debería haber añadido req.user si el token es válido
  if (req.user && req.user.rol === 'admin') {
    // Si el usuario existe y su rol es 'admin', permite el paso al siguiente controlador
    next();
  } else {
    // Si no es admin, envía un error 403 Forbidden (Prohibido)
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

// Exportamos ambas funciones
module.exports = { protect, isAdmin };
