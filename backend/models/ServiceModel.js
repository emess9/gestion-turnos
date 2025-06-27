import mongoose from 'mongoose';

// Define el esquema para los servicios con nombre, descripcion y duracion
const serviceSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio.'],
      trim: true,
      unique: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    duracion: {
      type: Number,
      required: [true, 'La duración del servicio es obligatoria (en minutos).'],
      default: 60,
    },
  },
  {
    timestamps: true, 
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
