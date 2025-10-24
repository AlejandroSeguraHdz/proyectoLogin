// modelos/productos.model.js
import mongoose from 'mongoose'

const esquemaProducto = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  imagen: { type: String },
  imagenMimeType: { type: String },
  codigo: { type: String },
  precio: { type: mongoose.Schema.Types.Double },
  cantidad: { type: Number, required: true },
  activo: { type: Boolean, required: true, default: true },

  // <-- Nueva relación con categoría
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: false // poner true si quieres exigir categoría
  }

}, {
  timestamps: true
});

export default mongoose.model("Producto", esquemaProducto);
