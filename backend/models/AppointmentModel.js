const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    // Usamos tipo Date para almacenar la fecha completa, aunque nos enfoquemos en el día.
    // Esto facilita las consultas por rangos de fechas en el futuro.
    fecha: {
      type: Date,
      required: [true, 'La fecha del turno es obligatoria.'],
    },
    // Guardamos la hora como un string simple para facilitar la visualización. Ej: "09:00", "10:00"
    horaInicio: {
      type: String,
      required: [true, 'La hora de inicio del turno es obligatoria.'],
    },
    estado: {
      type: String,
      required: true,
      enum: ['disponible', 'reservado'], // El turno solo puede tener estos dos estados
      default: 'disponible',
    },
    // Aquí creamos una referencia a la colección de Usuarios.
    clienteId: {
      type: mongoose.Schema.Types.ObjectId, // Almacenará el _id de un usuario
      ref: 'User', // Le dice a Mongoose que este ID corresponde a un documento en la colección 'User'
      // No es 'required' porque un turno 'disponible' no tiene un cliente asignado.
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt
  }
);

// Para evitar que se pueda agendar el mismo turno (misma fecha y hora) dos veces.
// Creamos un índice compuesto único.
appointmentSchema.index({ fecha: 1, horaInicio: 1 }, { unique: true });


const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
