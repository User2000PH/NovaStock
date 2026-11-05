
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const rutasProductos = require('./routes/productos');
const rutasAuth = require('./routes/auth');

const app = express();

const PORT = process.env.PORT || 3000;

// Verificar configuración
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Faltan variables de entorno en el archivo .env');
  process.exit(1);
}

// Seguridad HTTP
app.use(helmet());

// Permitir conexiones desde Angular y React
const origenesPermitidos = [
  'http://localhost:4200',
  'http://localhost:5173'
];

app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:5173',
    'http://localhost:5174'
  ]
}));

// Leer JSON
app.use(express.json({ limit: '10kb' }));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    proyecto: 'NovaStock',
    estado: 'Servidor funcionando',
    tecnologias: [
      'Node.js',
      'Express',
      'MongoDB'
    ],
    endpoints: {
      autenticacion: '/api/auth',
      productos: '/api/productos'
    }
  });
});

// Rutas de la API
app.use('/api/auth', rutasAuth);
app.use('/api/productos', rutasProductos);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada.'
  });
});

// Iniciar servidor
async function iniciarServidor() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB conectado correctamente.');

    app.listen(PORT, () => {
      console.log(
        `NovaStock activo en http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.error(
      'Error al iniciar el servidor:',
      error.message
    );

    process.exit(1);
  }
}

iniciarServidor();