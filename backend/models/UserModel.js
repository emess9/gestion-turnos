const mongoose = require('mongoose');

// esquema para el usuario
const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'], 
      trim: true, // Elimina espacios
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true, //email unico
      trim: true,
      lowercase: true, // email en minúsculas 
      match: [ // Validación básica  email
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, introduce un email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [4, 'La contraseña debe tener al menos 4 caracteres'], 
    },
    rol: {
      type: String,
      enum: ['cliente', 'admin'], // dos valores
      default: 'cliente', 
    },
  },
  {
    timestamps: true, // Añade automáticamente los campos createdAt y updatedAt
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User; // Exportamos el modelo 