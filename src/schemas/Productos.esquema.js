import mongoose from 'mongoose';

export const esquemaRegistrarProducto = new mongoose.Schema({
 codigo: {
    type: String,
  },
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
 
  // Cambiado: guardamos el binario en Buffer y el tipo MIME
 // CAMBIO CLAVE: Ahora almacena la RUTA del archivo en el disco (ej: "/uploads/123456.jpg")
    imagen: {
        type: String, 
        required: false, // La imagen es opcional
    },
    // Este campo guarda el tipo MIME para reconstruir el Data URL en el frontend
    imagenMimeType: {
        type: String,
        required: false,
    },
 
  precio: {
    type: Number,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true
  },
  activo: {
    type: Boolean,
    required: true,
    default: true
  },
}, {
  timestamps: true
});
