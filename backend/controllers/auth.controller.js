const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRAR USUARIO
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Comprobar campos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios.'
      });
    }

    // Validar correo
    const correo = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      return res.status(400).json({
        mensaje: 'Ingresa un correo electrónico válido.'
      });
    }

    // Validar contraseña
    if (password.length < 8) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 8 caracteres.'
      });
    }

    // Comprobar si el usuario existe
    const usuarioExiste = await User.findOne({ email: correo });

    if (usuarioExiste) {
      return res.status(409).json({
        mensaje: 'Este correo ya está registrado.'
      });
    }

    // Cifrar contraseña
    const passwordCifrada = await bcrypt.hash(password, 10);

    // Crear usuario con rol por defecto: consulta
    const nuevoUsuario = await User.create({
      nombre: nombre.trim(),
      email: correo,
      password: passwordCifrada
    });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente.',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error('Error al registrar:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: 'Este correo ya está registrado.'
      });
    }

    res.status(500).json({
      mensaje: 'Error al registrar el usuario.'
    });
  }
};


// INICIAR SESIÓN
const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Ingresa tu correo y contraseña.'
      });
    }

    const correo = email.trim().toLowerCase();

    // Buscar usuario incluyendo la contraseña
    const usuario = await User.findOne({
      email: correo
    }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    // Comparar contraseña
    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    // Comprobar secreto JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        mensaje: 'Falta configurar JWT_SECRET.'
      });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);

    res.status(500).json({
      mensaje: 'Error al iniciar sesión.'
    });
  }
};


// EXPORTAR FUNCIONES
module.exports = {
  registrarUsuario,
  iniciarSesion
};