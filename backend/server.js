require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Importamos las rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); 

const app = express();

// Middlewares
app.use(express.json());
// ...

// Conexión a MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB conectado exitosamente a Atlas!'))
  .catch(err => {
    console.error('Error al conectar a MongoDB Atlas:', err.message);
  });


// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes); 

// ...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
