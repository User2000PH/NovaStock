const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: [true, 'El código es obligatorio'],
      unique: true,
      trim: true,
      uppercase: true
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: 2
    },
    categoria: {
      type: String,
      required: true,
      enum: [
        'Computadoras',
        'Accesorios',
        'Perifericos',
        'Almacenamiento',
        'Otros'
      ]
    },
    precio: {
      type: Number,
      required: true,
      min: 0.01
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'El stock debe ser un número entero'
      }
    },
    descripcion: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Producto', productoSchema);