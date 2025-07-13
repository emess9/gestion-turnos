import Appointment from '../models/AppointmentModel.js'; // modelo de turnos

// Formatear la fecha a DD/MM/YYYY (Argentina)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

// @desc Generar turnos para un día específico
// @route POST /api/appointments/generate
// @access Private/Admin
export const generateAppointments = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Por favor, proporciona una fecha.' });
    }

    // --- LÓGICA DE VERIFICACIÓN CORREGIDA Y ROBUSTA ---
    // 1. Definimos el inicio y el fin del día seleccionado en UTC.
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    // 2. Buscamos si ya existe CUALQUIER turno dentro de ese rango de 24 horas.
    const existingAppointment = await Appointment.findOne({
      fecha: { $gte: startDate, $lte: endDate }
    });

    // 3. Si encontramos uno, devolvemos el error amigable.
    if (existingAppointment) {
      return res.status(409).json({ message: `Los turnos para el ${formatDate(date)} ya han sido generados.` });
    }
    // --- FIN DE LA CORRECCIÓN ---


    // 4. Si no hay turnos, procedemos a crearlos.
    const startTime = 9;
    const endTime = 20;
    const appointmentsToCreate = [];
    const targetDate = new Date(`${date}T00:00:00.000Z`); 

    for (let hour = startTime; hour < endTime; hour++) {
      const horaInicio = `${hour.toString().padStart(2, '0')}:00`;
      appointmentsToCreate.push({
        fecha: targetDate,
        horaInicio,
        estado: 'disponible',
      });
    }

    await Appointment.insertMany(appointmentsToCreate);

    res.status(201).json({
      message: `Turnos generados con éxito para el ${formatDate(date)}.`
    });

  } catch (error) {
    console.error('Error al generar los turnos:', error);
    res.status(500).json({ message: 'Error del servidor al generar los turnos.' });
  }
};


export const getAppointmentsByDay = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Por favor, proporciona una fecha en el query string (formato YYYY-MM-DD).' });
    }
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);
    const appointments = await Appointment.find({
      fecha: { $gte: startDate, $lte: endDate },
    }).sort({ horaInicio: 'asc' });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error al obtener los turnos por día:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los turnos.' });
  }
};


export const bookAppointment = async (req, res) => {
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

// @desc Cancelar turno
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Turno no encontrado.' });
    }
    const esDueñoDelTurno = appointment.clienteId?.toString() === req.user._id.toString();
    const esAdmin = req.user.rol === 'admin';
    if (!esDueñoDelTurno && !esAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar este turno.' });
    }
    appointment.estado = 'disponible';
    appointment.clienteId = undefined;
    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error al cancelar el turno:', error);
    res.status(500).json({ message: 'Error del servidor al cancelar el turno.' });
  }
};


export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ clienteId: req.user._id }).sort({ fecha: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error al obtener mis turnos:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los turnos.' });
  }
};
