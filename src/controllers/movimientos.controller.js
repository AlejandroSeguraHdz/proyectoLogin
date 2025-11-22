
import  Movimiento  from "../models/MovimientosProdutos.model.js";


export const getMovimientos = async (req,res) => {
     try {
    const movimientos = await Movimiento.find({
      producto: req.params.id   // <-- el ID del producto
    }).sort({ createdAt: -1 }); // opcional: más recientes primero

    res.json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener movimientos" });
  }
  
}