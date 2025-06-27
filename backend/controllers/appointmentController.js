import Appointment from '../models/AppointmentModel.js'; 

// Función para formatear la fecha 
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

// Crea slots de turnos para un día específico 
export const generateAppointments = async (req, res) => {
  try {
    const { date } = req.body;

    // Chequeamos si mandaron la fecha. Si no, devolvemos un error.
    if (!date) {
      return res.status(400).json({ message: 'Por favor, proporciona una fecha.' });
    }

    // Definimos el horario de inicio y fin para los turnos (de 9:00 a 19:00).
    const startTime = 9;
    const endTime = 20;
    const appointmentsToCreate = [];
    const targetDate = new Date(`${date}T00:00:00.000Z`);

    // Recorremos las horas para crear un objeto de turno por cada una.
    for (let hour = startTime; hour < endTime; hour++) {
      const horaInicio = `${hour.toString().padStart(2, '0')}:00`;
      appointmentsToCreate.push({
        fecha: targetDate,
        horaInicio,
        estado: 'disponible',
      });
    }

    // Insertamos todos los turnos en la base de datos de una sola vez.
    await Appointment.insertMany(appointmentsToCreate, { ordered: false });

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

//  Obtiene los turnos para una fecha concreta
export const getAppointmentsByDay = async (req, res) => {
  try {
    const { date } = req.query;

    // Pedimos la fecha en la URL, si no la mandan, error.
    if (!date) {
      return res.status(400).json({ message: 'Por favor, proporciona una fecha en el query string (formato YYYY-MM-DD).' });
    }

    // Definimos el rango de fecha para buscar turnos en todo el día.
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    // Buscamos todos los turnos dentro de ese rango y los ordenamos por hora.
    const appointments = await Appointment.find({
      fecha: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ horaInicio: 'asc' });

    // Devolvemos la lista de turnos que encontramos.
    res.status(200).json(appointments);

  } catch (error) {
    console.error('Error al obtener los turnos por día:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los turnos.' });
  }
};

// Permite a un usuario reservar un turno disponible.
export const bookAppointment = async (req, res) => {
  try {
    // Buscamos el turno por su ID en la base de datos.
    const appointment = await Appointment.findById(req.params.id);

    // Si no encontramos el turno, avisamos.
    if (!appointment) {
      return res.status(404).json({ message: 'Turno no encontrado.' });
    }

    // Si el turno ya está reservado, no se puede reservar de nuevo.
    if (appointment.estado !== 'disponible') {
      return res.status(400).json({ message: 'Este turno ya no está disponible.' });
    }

    // Cambiamos el estado a 'reservado' y asignamos el ID del cliente.
    appointment.estado = 'reservado';
    appointment.clienteId = req.user._id;

    // Guardamos los cambios en la base de datos.
    const updatedAppointment = await appointment.save();

    // Devolvemos el turno actualizado.
    res.status(200).json(updatedAppointment);

  } catch (error) {
    console.error('Error al reservar el turno:', error);
    res.status(500).json({ message: 'Error del servidor al reservar el turno.' });
  }
};

// Permite a un usuario o administrador cancelar un turno.
export const cancelAppointment = async (req, res) => {
  try {
    // Buscamos el turno por su ID.
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Turno no encontrado.' });
    }

    // Verificamos si el usuario es el dueño del turno o si es un administrador.
    const esDueñoDelTurno = appointment.clienteId?.toString() === req.user._id.toString();
    const esAdmin = req.user.rol === 'admin';

    // Si no tiene permiso, lo denegamos.
    if (!esDueñoDelTurno && !esAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar este turno.' });
    }

    // Si tiene permiso, cambiamos el estado a 'disponible' y quitamos el ID del cliente.
    appointment.estado = 'disponible';
    appointment.clienteId = undefined;

    // Guardamos los cambios.
    const updatedAppointment = await appointment.save();

    // Devolvemos el turno actualizado.
    res.status(200).json(updatedAppointment);

  } catch (error) {
    console.error('Error al cancelar el turno:', error);
    res.status(500).json({ message: 'Error del servidor al cancelar el turno.' });
  }
};

// obtener turnos de un usuario
export const getMyAppointments = async (req, res) => {
  try {
    // Buscamos todos los turnos que tengan el ID del cliente logueado.
    const appointments = await Appointment.find({ clienteId: req.user._id })
      .sort({ fecha: -1 }); 

    // Devolvemos la lista de turnos del usuario.
    res.status(200).json(appointments);

  } catch (error) {
    console.error('Error al obtener mis turnos:', error);
    res.status(500).json({ message: 'Error del servidor al obtener los turnos.' });
  }
};