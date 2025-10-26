
import Venta from '../models/Venta.model.js'



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

        console.log(items)
        console.log(subtotal)
        console.log(impuesto)
        console.log(descuento)
        console.log(total)
        console.log(metodoPago)
        console.log(pagoRef)
        console.log(notas)


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

        const nv = await nuevaVenta.save();
        res.status(201).json(nv);

     } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

