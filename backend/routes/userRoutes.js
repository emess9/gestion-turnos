const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Importamos  middleware protect

// @desc    Obtener el perfil del usuario autenticado
// @route   GET /api/users/profile
// @access  Private (requiere token)
router.get('/profile', protect, (req, res) => {
  // Gracias al middleware 'protect', si llegamos aquí, 'req.user' contiene
  // la información del usuario autenticado (excluyendo la contraseña).
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      nombre: req.user.nombre,
      email: req.user.email,
      rol: req.user.rol,
      // podrías añadir más campos si los tuvieras en el modelo User
    });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado.' });
  }
});

// Por ejemplo: actualizar perfil, etc.

module.exports = router;
