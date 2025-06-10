const express = require('express');
const router = express.Router();
const {
  createService,
  getServices,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// --- Rutas Públicas ---
// Obtener todos los servicios. Cualquiera puede ver qué servicios se ofrecen.
router.get('/', getServices);

// --- Rutas de Administrador ---
// Para crear, actualizar y eliminar servicios, se necesita ser un administrador.
// Usamos protect para asegurar que el usuario esté logueado y isAdmin para verificar su rol.
router.post('/', protect, isAdmin, createService);
router.put('/:id', protect, isAdmin, updateService);
router.delete('/:id', protect, isAdmin, deleteService);

module.exports = router;
