import mongoose from 'mongoose';

// Define el esquema para los turnos
const appointmentSchema = new mongoose.Schema(
  {
    // Fecha completa del turno
    fecha: {
      type: Date,
      required: [true, 'La fecha del turno es obligatoria.'],
    },
    // Hora como texto legible
    horaInicio: {
      type: String,
      required: [true, 'La hora de inicio del turno es obligatoria.'],
    },
    estado: {
      type: String,
      required: true,
      enum: ['disponible', 'reservado'],
      default: 'disponible',
    },
    // Usuario que reservó el turno 
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Prevenir turnos duplicados en misma fecha y hora
appointmentSchema.index({ fecha: 1, horaInicio: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
