const User = require('../models/UserModel'); //modelo de Usuario
const bcrypt = require('bcryptjs'); //  encriptar contraseñas
const jwt = require('jsonwebtoken'); //  generar JSON Web Tokens

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // datos necesarios estén presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Por favor, incluye nombre, email y contraseña.' });
    }

    // Convertir email a minúsculas 
    const emailMinusculas = email.toLowerCase();

    // 2. Verificar si el usuario ya existe por email
    const userExists = await User.findOne({ email: emailMinusculas });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario con este email ya existe.' });
    }

    // 3. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Crear el nuevo usuario
    // Si 'rol' no se provee en req.body, tomará el default 'cliente' del modelo UserModel
    const user = await User.create({
      nombre,
      email: emailMinusculas, 
      password: hashedPassword,
      rol,
    });

    // 5. Si el usuario se creó correctamente, generar un token JWT
    if (user) {
      const token = jwt.sign(
        { userId: user._id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // 6. Enviar respuesta con el token y datos básicos del usuario
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email, 
        rol: user.rol,
        token: token,
      });
    } else {
      // Este caso es poco probable si User.create no lanza un error antes
      res.status(400).json({ message: 'Datos de usuario inválidos al intentar crear.' });
    }
  } catch (error) {
    console.error('Error en registerUser:', error);
    // Si es un error de validación de Mongoose
    if (error.name === 'ValidationError') {
        // Extraer mensajes de error de validación de Mongoose
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error del servidor al registrar el usuario.', error: error.message });
  }
};

// @desc    Autenticar (login) un usuario existente
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que los datos necesarios estén presentes
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, incluye email y contraseña.' });
    }

    // 2. Buscar al usuario por email en la base de datos
    // Convertimos el email a minúsculas para asegurar consistencia con cómo lo guardamos
    const user = await User.findOne({ email: email.toLowerCase() });

    // 3. Si el usuario no existe, o si existe pero la contraseña no coincide
    if (!user) {
      // Respuesta genérica para no dar pistas sobre si el email existe o no
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 4. Comparar la contraseña ingresada con la contraseña hasheada en la BD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Respuesta genérica
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 5. Si las credenciales son correctas, generar un token JWT
    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 6. Enviar respuesta con el token y datos básicos del usuario
    res.status(200).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      token: token,
    });

  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ message: 'Error del servidor al intentar iniciar sesión.', error: error.message });
  }
};

// Exportamos ambas funciones
module.exports = {
  registerUser,
  loginUser,
};