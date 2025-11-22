// models/Venta.js
import mongoose from "mongoose";

const VentaItemSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
  codigo: { type: String, required: true },               // snapshot
  nombre: { type: String, required: true },            // snapshot
  precioUnitario: { type: Number, required: true },    // precio al momento de la venta
  cantidad: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },          // precioUnitario * cantidad
  // opcional: impuestos por ítem, descuentos por ítem, etc.
}, { _id: false });

const VentaSchema = new mongoose.Schema({
  numero: { type: String, index: true },               // opcional: folio legible
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // comprador (nullable si venta anónima)
  items: { type: [VentaItemSchema], required: true, validate: v => Array.isArray(v) && v.length > 0 },
  subtotal: { type: Number, required: true },          // suma de subtotales
  impuesto: { type: Number, default: 0 },              // total impuestos (si aplica)
  descuento: { type: Number, default: 0 },             // total descuentos
  total: { type: Number, required: true },             // subtotal + impuesto - descuento
  metodoPago: { type: String },                        // p.ej. "efectivo", "stripe", "paypal" (NO datos de tarjeta)
  pagoRef: { type: String },                           // id de transacción/pago (token)
  estado: {                                           // status de la venta
    type: String,
    enum: ["pendiente", "pagado", "cancelado", "devuelto"],
    default: "pendiente"
  },
  tiendaId: { type: mongoose.Schema.Types.ObjectId, ref: "Tienda", required: false }, // si multi-branch
  notas: { type: String },
}, { timestamps: true });

// índices útiles
VentaSchema.index({ usuarioId: 1, createdAt: -1 });
VentaSchema.index({ numero: 1 }, { unique: true, sparse: true });

export default mongoose.model("Venta", VentaSchema);
