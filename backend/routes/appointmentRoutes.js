// backend/routes/appointmentRoutes.js
import express from 'express';
import {
  generateAppointments,
  getAppointmentsByDay,
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
} from '../controllers/appointmentController.js';

import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas para administración
router.post('/generate', protect, isAdmin, generateAppointments);

// Ruta pública
router.get('/', getAppointmentsByDay);

// Rutas privadas del usuario autenticado
router.get('/my-appointments', protect, getMyAppointments);
router.put('/book/:id', protect, bookAppointment);
router.put('/cancel/:id', protect, cancelAppointment);

export default router;
