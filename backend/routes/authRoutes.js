const express = require('express');
const router = express.Router();

// Importamos ambas funciones de authController
const { registerUser, loginUser } = require('../controllers/authController');

// Ruta para el registro de usuarios
// POST /api/auth/register
router.post('/register', registerUser);

// Ruta para el login de usuarios
// POST /api/auth/login
router.post('/login', loginUser); 

module.exports = router;
