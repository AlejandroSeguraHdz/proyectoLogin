
import Movimiento from '../models/MovimientosProdutos.model.js';
import Venta from '../models/Venta.model.js'
import Producto from "../models/productos.model.js";


export const getVentas = async (req, res) => {
  try {

    const ventas = await Venta.find();
    res.json(ventas);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const guardarVenta = async (req, res) => {
  try {
    const { items, subtotal, impuesto, descuento, total, metodoPago, pagoRef, notas } = req.body



    const nuevaVenta = new Venta({
      items,
      subtotal,
      impuesto,
      total,
      descuento,
      metodoPago,
      pagoRef,
      notas,

    });


    for (let i = 0; i < items.length; i++) {
      const producto = await Producto.findById(items[i].productoId);

      console.log(items[i])
      producto.cantidad = producto.cantidad - items[i].cantidad
     await producto.save()

      await Movimiento.create({
        producto: items[i].productoId,
        tipo: "Venta",
        cantidad: items[i].cantidad,
      });

    }
    const nv = await nuevaVenta.save();
    res.status(201).json(nv);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

