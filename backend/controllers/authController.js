const User = require('../models/UserModel'); //modelo de Usuario
const bcrypt = require('bcryptjs'); //  encriptar contraseñas
const jwt = require('jsonwebtoken'); //  generar JSON Web Tokens


const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // datos necesarios estén presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Por favor, incluye nombre, email y contraseña.' });
    }

    // 2. Verificar si el usuario ya existe por email
    const userExists = await User.findOne({ email });
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
      email,
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

module.exports = {
  registerUser,
  // Aquí añadiremos loginUser más tarde
};