const Appointment = require('../models/AppointmentModel');

// @desc    Generar turnos para un día específico
// @route   POST /api/appointments/generate
// @access  Private/Admin
const generateAppointments = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Por favor, proporciona una fecha.' });
    }
    
    // Horarios de apertura y cierre
    const startTime = 9; // 9:00 AM
    const endTime = 20; // 8:00 PM (el último turno empieza a las 19:00)

    const appointmentsToCreate = [];
    const targetDate = new Date(`${date}T00:00:00.000Z`);

    // Generamos un turno por cada hora
    for (let hour = startTime; hour < endTime; hour++) {
      const horaInicio = `${hour.toString().padStart(2, '0')}:00`;

      appointmentsToCreate.push({
        fecha: targetDate,
        horaInicio: horaInicio,
        estado: 'disponible',
      });
    }

    // Usamos insertMany para una inserción masiva, pero con cuidado por los duplicados.
    // El índice único que creamos en el modelo nos protegerá de duplicar turnos
    // para la misma fecha y hora. Si intentamos generar turnos para un día que ya
    // tiene turnos, la operación fallará para los duplicados.
    await Appointment.insertMany(appointmentsToCreate, { ordered: false });

    res.status(201).json({ 
      message: `Se intentaron crear ${appointmentsToCreate.length} turnos para el ${date}.`,
      turnosCreados: appointmentsToCreate
    });

  } catch (error) {
    // Si el error es por clave duplicada (código 11000)
    if (error.code === 11000) {
      return res.status(409).json({ message: `Los turnos para este día ya existen o algunos de ellos.` });
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
  try {
    // 1. Buscamos el turno por su ID, que viene en los parámetros de la URL
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Turno no encontrado.' });
    }

    // 2. Verificamos que el turno esté disponible
    if (appointment.estado !== 'disponible') {
      return res.status(400).json({ message: 'Este turno ya no está disponible.' });
    }

    // 3. Actualizamos el turno
    appointment.estado = 'reservado';
    // Asignamos el ID del cliente. req.user fue añadido por el middleware 'protect'
    appointment.clienteId = req.user._id;

    // 4. Guardamos los cambios en la base de datos
    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);

  } catch (error) {
    console.error('Error al reservar el turno:', error);
    res.status(500).json({ message: 'Error del servidor al reservar el turno.' });
  }
};

module.exports = {
  generateAppointments,
  getAppointmentsByDay,
  bookAppointment,
};
