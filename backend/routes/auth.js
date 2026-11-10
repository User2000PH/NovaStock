const express = require('express');

const {
  registrarUsuario,
  iniciarSesion
} = require('../controllers/auth.controller');

const {
  verificarToken
} = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/registro', registrarUsuario);

router.post('/login', iniciarSesion);

router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Sesión válida.',
    usuario: req.usuario
  });
});

module.exports = router;