const jwt = require('jsonwebtoken');

// VERIFICAR TOKEN
const verificarToken = (req, res, next) => {
  try {
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Acceso denegado. Debes iniciar sesión.'
      });
    }

    const token = autorizacion.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado.'
    });
  }
};


// VERIFICAR ROLES
const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {

    if (!req.usuario) {
      return res.status(401).json({
        mensaje: 'Debes iniciar sesión.'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para realizar esta acción.'
      });
    }

    next();
  };
};


module.exports = {
  verificarToken,
  permitirRoles
};