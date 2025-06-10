const express = require('express');
const router = express.Router();
const {
  generateAppointments,
  getAppointmentsByDay,
  bookAppointment,
} = require('../controllers/appointmentController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// --- Ruta de Administrador ---
// Generar los turnos disponibles para un día
router.post('/generate', protect, isAdmin, generateAppointments);

// --- Ruta Pública ---
// Obtener todos los turnos para un día específico (query param ?date=YYYY-MM-DD)
router.get('/', getAppointmentsByDay);

// --- Ruta Privada para Clientes ---
// Reservar un turno específico por su ID
router.put('/book/:id', protect, bookAppointment);


module.exports = router;
