// backend/routes/userRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta protegida: obtener perfil del usuario autenticado
router.get('/profile', protect, (req, res) => {
  if (req.user) {
    res.status(200).json({
      _id: req.user._id,
      nombre: req.user.nombre,
      email: req.user.email,
      rol: req.user.rol,
    });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado.' });
  }
});

export default router;