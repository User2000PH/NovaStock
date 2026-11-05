
const express = require('express');
const Producto = require('../models/Producto');

const {
  verificarToken,
  permitirRoles
} = require('../middleware/auth.middleware');

const router = express.Router();

// Todas las rutas requieren iniciar sesión
router.use(verificarToken);

// CONSULTAR TODOS LOS PRODUCTOS
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().sort({
      createdAt: -1
    });

    res.json(productos);

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al consultar productos.'
    });
  }
});

// CONSULTAR UN PRODUCTO
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado.'
      });
    }

    res.json(producto);

  } catch (error) {
    res.status(400).json({
      mensaje: 'ID de producto no válido.'
    });
  }
});

// CREAR PRODUCTO
router.post(
  '/',
  permitirRoles('admin', 'editor'),
  async (req, res) => {
    try {
      const {
        codigo,
        nombre,
        categoria,
        precio,
        stock,
        descripcion
      } = req.body;

      if (
        !codigo ||
        !nombre ||
        !categoria ||
        precio === undefined ||
        stock === undefined
      ) {
        return res.status(400).json({
          mensaje: 'Completa todos los campos obligatorios.'
        });
      }

      const producto = await Producto.create({
        codigo,
        nombre,
        categoria,
        precio,
        stock,
        descripcion
      });

      res.status(201).json({
        mensaje: 'Producto registrado correctamente.',
        producto
      });

    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          mensaje: 'El código del producto ya existe.'
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          mensaje: error.message
        });
      }

      res.status(500).json({
        mensaje: 'Error al registrar el producto.'
      });
    }
  }
);

// ACTUALIZAR PRODUCTO
router.put(
  '/:id',
  permitirRoles('admin', 'editor'),
  async (req, res) => {
    try {
      const camposPermitidos = [
        'codigo',
        'nombre',
        'categoria',
        'precio',
        'stock',
        'descripcion'
      ];

      const datos = {};

      camposPermitidos.forEach(campo => {
        if (req.body[campo] !== undefined) {
          datos[campo] = req.body[campo];
        }
      });

      const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        datos,
        {
          new: true,
          runValidators: true
        }
      );

      if (!producto) {
        return res.status(404).json({
          mensaje: 'Producto no encontrado.'
        });
      }

      res.json({
        mensaje: 'Producto actualizado correctamente.',
        producto
      });

    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          mensaje: 'El código del producto ya existe.'
        });
      }

      res.status(400).json({
        mensaje: error.message || 'No se pudo actualizar.'
      });
    }
  }
);

// ELIMINAR PRODUCTO
router.delete(
  '/:id',
  permitirRoles('admin'),
  async (req, res) => {
    try {
      const producto = await Producto.findByIdAndDelete(
        req.params.id
      );

      if (!producto) {
        return res.status(404).json({
          mensaje: 'Producto no encontrado.'
        });
      }

      res.json({
        mensaje: 'Producto eliminado correctamente.'
      });

    } catch (error) {
      res.status(400).json({
        mensaje: 'ID de producto no válido.'
      });
    }
  }
);

module.exports = router;