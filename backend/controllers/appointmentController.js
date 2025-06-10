const Appointment = require('../models/AppointmentModel');

// @desc    Generar turnos para un día específico
// @route   POST /api/appointments/generate
// @access  Private/Admin
const generateAppointments = async (req, res) => {
  // TODO: Implementar lógica para generar turnos para un día
  res.status(201).json({ message: 'Ruta para generar turnos alcanzada.' });
};

// @desc    Obtener los turnos de un día específico
// @route   GET /api/appointments?date=YYYY-MM-DD
// @access  Public
const getAppointmentsByDay = async (req, res) => {
    try {
      // 1. Obtener la fecha del query string
      const { date } = req.query;
  
      if (!date) {
        return res.status(400).json({ message: 'Por favor, proporciona una fecha en el query string (formato YYYY-MM-DD).' });
      }
  
      // 2. Crear las fechas de inicio y fin del día
      // new Date(date) puede interpretar mal la fecha dependiendo de la zona horaria.
      // Es más seguro construirla así para asegurar que sea UTC.
      const startDate = new Date(`${date}T00:00:00.000Z`);
      const endDate = new Date(`${date}T23:59:59.999Z`);
  
      // 3. Buscar en la base de datos los turnos que estén dentro de ese día
      const appointments = await Appointment.find({
        fecha: {
          $gte: startDate, // $gte significa "greater than or equal to" (mayor o igual que)
          $lte: endDate,   // $lte significa "less than or equal to" (menor o igual que)
        },
      }).sort({ horaInicio: 'asc' }); // .sort() los ordena por hora de inicio ascendente
  
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
  // TODO: Implementar lógica para que un cliente reserve un turno
  res.status(200).json({ message: `Ruta para reservar el turno ${req.params.id} alcanzada.` });
};

module.exports = {
  generateAppointments,
  getAppointmentsByDay,
  bookAppointment,
};
