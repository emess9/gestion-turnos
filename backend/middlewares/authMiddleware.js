const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); 

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si el token existe en los headers y tiene el formato correcto
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Obtener el token del header 
      token = req.headers.authorization.split(' ')[1]; 

      // 3. Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Obtener el usuario a partir del ID en el token y adjuntarlo a req.user
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado.' });
      }

      // 5. Si todo es correcto, pasar al siguiente middleware 
      next();

    } catch (error) {
      console.error('Error al verificar el token:', error.message);
      // Si el token es inválido  jwt.verify lanzará un error
      return res.status(401).json({ message: 'No autorizado, token inválido.' });
    }
  }

  // Si no hay token en los headers 
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se proporcionó token.' });
  }
};

// Podríamos añadir un middleware 

module.exports = { protect };
