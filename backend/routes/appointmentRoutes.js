const express = require('express');
const router = express.Router();
const {
  generateAppointments,
  getAppointmentsByDay,
  bookAppointment,
  cancelAppointment,
  getMyAppointments, // obtener turnos de un cliente
} = require('../controllers/appointmentController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// --- Rutas de Administrador ---
router.post('/generate', protect, isAdmin, generateAppointments);

// --- Ruta Pública ---
router.get('/', getAppointmentsByDay);

// --- Rutas Privadas ---
router.get('/my-appointments', protect, getMyAppointments); 
router.put('/book/:id', protect, bookAppointment);
router.put('/cancel/:id', protect, cancelAppointment);


module.exports = router;
