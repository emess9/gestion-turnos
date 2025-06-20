const Appointment = require('../models/AppointmentModel');

// formatear la fecha a DD/MM/YYYY Formato ARGY
const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Ajustamos por la zona horaria 
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

// @desc    Generar turnos para un día específico
// @route   POST /api/appointments/generate
// @access  Private/Admin
const generateAppointments = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Por favor, proporciona una fecha.' });
    }
    
    const startTime = 9;
    const endTime = 20;

    const appointmentsToCreate = [];
    const targetDate = new Date(`${date}T00:00:00.000Z`);

    for (let hour = startTime; hour < endTime; hour++) {
      const horaInicio = `${hour.toString().padStart(2, '0')}:00`;
      appointmentsToCreate.push({
        fecha: targetDate,
        horaInicio: horaInicio,
        estado: 'disponible',
      });
    }

    await Appointment.insertMany(appointmentsToCreate, { ordered: false });

    // Mensaje de éxito mejorado
    res.status(201).json({ 
      message: `Turnos generados con éxito para el ${formatDate(date)}.`
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: `Los turnos para el ${formatDate(date)} ya existen.` });
    }
    console.error('Error al generar los turnos:', error);
    res.status(500).json({ message: 'Error del servidor al generar los turnos.' });
  }
};

// @desc    Obtener los turnos de un día específico
// @route   GET /api/appointments?date=YYYY-MM-DD
// @access  Public
const getAppointmentsByDay = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Por favor, proporciona una fecha en el query string (formato YYYY-MM-DD).' });
    }

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const appointments = await Appointment.find({
      fecha: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ horaInicio: 'asc' });

    res.status(200).json(appointments);

  } catch (error) {
    console.error('Error al obtener los turnos por día:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los turnos.' });
  }
};

// @desc    Reservar un turno
// @route   PUT /api/appointments/book/:id
// @access  Private
const bookAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Turno no encontrado.' });
    }

    if (appointment.estado !== 'disponible') {
      return res.status(400).json({ message: 'Este turno ya no está disponible.' });
    }

    appointment.estado = 'reservado';
    appointment.clienteId = req.user._id;

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);

  } catch (error) {
    console.error('Error al reservar el turno:', error);
    res.status(500).json({ message: 'Error del servidor al reservar el turno.' });
  }
};

// CANCELAR TURNOS

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Turno no encontrado.' });
    }

    // Verificar que el turno esté reservado para poder cancelarlo
    if (appointment.estado !== 'reservado') {
      return res.status(400).json({ message: 'Este turno no está reservado.' });
    }

    // Verificar permisos:
    // El usuario debe ser quien reservó el turno O debe ser un administrador.
    // toString() es importante porque comparamos ObjectIDs.
    const esDueñoDelTurno = appointment.clienteId.toString() === req.user._id.toString();
    const esAdmin = req.user.rol === 'admin';

    if (!esDueñoDelTurno && !esAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar este turno.' });
    }

    // Proceder con la cancelación:
    appointment.estado = 'disponible';
    appointment.clienteId = undefined; // o null

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);

  } catch (error) {
    console.error('Error al cancelar el turno:', error);
    res.status(500).json({ message: 'Error del servidor al cancelar el turno.' });
  }
};

// obtener turnos de un usuario

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ clienteId: req.user._id })
      .sort({ fecha: -1 }); // Ordenamos por fecha descendente 

    res.status(200).json(appointments);

  } catch (error) {
    console.error('Error al obtener mis turnos:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los turnos.' });
  }
};


module.exports = {
  generateAppointments,
  getAppointmentsByDay,
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
};
