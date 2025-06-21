// backend/models/ServiceModel.js
import mongoose from 'mongoose';

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
    // Si en algún momento se quiere agregar precio:
    // precio: { type: Number }
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
