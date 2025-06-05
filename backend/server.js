require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// const cors = require('cors'); // Aún no lo necesitamos, pero lo dejaremos comentado para el futuro

//  rutas de autenticación
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
// app.use(cors()); // Descomentar cuando necesitemos CORS
app.use(express.json()); // Para parsear JSON del body de las peticiones
app.use(express.urlencoded({ extended: false })); // Para parsear datos de formularios 

// Conexión a MongoDB 
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB conectado exitosamente a Atlas!'))
  .catch(err => {
    console.error('Error al conectar a MongoDB Atlas:', err.message);
    // Podrías querer terminar el proceso si la BD no conecta, dependiendo de tu app
    // process.exit(1); 
  });

// Rutas de la API
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Hola desde el backend de la peluquería! API funcionando.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});