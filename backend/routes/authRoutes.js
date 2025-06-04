const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController'); // Importamos controlador


router.post('/register', registerUser);

// Aquí añadiremos la ruta para /login más tarde

module.exports = router;
