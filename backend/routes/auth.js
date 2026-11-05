const express = require('express');

const {
  registrarUsuario,
  iniciarSesion
} = require('../controllers/auth.controller');

const {
  verificarToken
} = require('../middleware/auth.middleware');

const router = express.Router();

// Registrar usuario
router.post('/registro', registrarUsuario);

// Iniciar sesión
router.post('/login', iniciarSesion);

// Comprobar sesión
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Sesión válida.',
    usuario: req.usuario
  });
});

module.exports = router;