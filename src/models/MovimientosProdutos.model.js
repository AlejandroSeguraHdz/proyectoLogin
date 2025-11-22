import mongoose from "mongoose";

const esquemaMovimiento = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true
  },

  tipo: {
    type: String,
    required: true
  },

  cantidad: {
    type: Number,
  },

  // cantidad antes del movimiento (opcional pero MUY útil)
  cantidadAnterior: {
    type: Number
  },

  // cantidad resultante (después del movimiento)
  cantidadNueva: {
    type: Number
  },

  comentario: {
    type: String
  }

}, {
  timestamps: true
});

export default mongoose.model("Movimiento", esquemaMovimiento);
