const mongoose = require('mongoose');

// Definimos el esquema para los Servicios
const serviceSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio.'],
      trim: true,
      unique: true, // No queremos dos servicios con el mismo nombre
    },
    descripcion: {
      type: String,
      trim: true,
      // No es requerido, puede estar vacío
    },
    duracion: {
      type: Number,
      required: [true, 'La duración del servicio es obligatoria (en minutos).'],
      default: 60, // Por defecto, asumimos que un servicio dura 60 minutos
    },
    // Podríamos añadir un campo de 'precio' en el futuro si quisiéramos
    // precio: {
    //   type: Number,
    // }
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Creamos el modelo 'Service' a partir del esquema 'serviceSchema'
// Mongoose buscará la colección 'services' en la base de datos
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
