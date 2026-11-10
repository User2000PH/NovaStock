const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios.'
      });
    }

    const correo = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      return res.status(400).json({
        mensaje: 'Ingresa un correo electrónico válido.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 8 caracteres.'
      });
    }

    const usuarioExiste = await User.findOne({ email: correo });

    if (usuarioExiste) {
      return res.status(409).json({
        mensaje: 'Este correo ya está registrado.'
      });
    }

    const passwordCifrada = await bcrypt.hash(password, 10);

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

const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Ingresa tu correo y contraseña.'
      });
    }

    const correo = email.trim().toLowerCase();

    const usuario = await User.findOne({
      email: correo
    }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        mensaje: 'Falta configurar JWT_SECRET.'
      });
    }

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

module.exports = {
  registrarUsuario,
  iniciarSesion
};