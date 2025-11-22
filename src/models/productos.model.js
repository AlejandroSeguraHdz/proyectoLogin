// modelos/productos.model.js
import mongoose from 'mongoose'

const esquemaProducto = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  imagen: { type: String },
  imagenMimeType: { type: String },
  precio: { type:Number },
  cantidad: { type: Number, required: true },
  activo: { type: Boolean, required: true, default: true },

  // <-- Nueva relación con categoría
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true
  }

}, {
  timestamps: true
});

export default mongoose.model("Producto", esquemaProducto);
