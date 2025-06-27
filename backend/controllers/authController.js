import User from '../models/UserModel.js'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 

// Crea un nuevo usuario y genera un JWT.
export const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Por favor, incluye nombre, email y contraseña.' });
    }

    const emailMinusculas = email.toLowerCase();

    const userExists = await User.findOne({ email: emailMinusculas });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario con este email ya existe.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      nombre,
      email: emailMinusculas,
      password: hashedPassword,
      rol,
    });

    if (user) {
      const token = jwt.sign(
        { userId: user._id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

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
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error del servidor al registrar el usuario.', error: error.message });
  }
};

// Autentica a un usuario verificando su contraseña y genera un JWT si las credenciales son correctas
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, incluye email y contraseña.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

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
