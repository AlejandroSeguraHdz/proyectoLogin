
import Producto from "../models/productos.model.js"

export const crearProducto = async (req, res) => {
    try {
        const { sku, nombre, descripcion, precio, cantidad } = req.body

        const productFound = await Producto.findOne({ sku });

        if (productFound)
            return res.status(400).json(["SKU ya registrado"]);

        const nuevoProducto = Producto({
            sku,
            nombre,
            descripcion,
            precio,
            cantidad
        })
        const savedProduct = await nuevoProducto.save()
        res.json(savedProduct)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const getProductos = async (req, res) => {
  try {
    // Filtra solo los productos activos
    const productos = await Producto.find({ activo: true });
    res.json(productos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductosDesactivados = async (req, res) => {
  try {
    // Filtra solo los productos activos
    const productos = await Producto.find({ activo: false });
    res.json(productos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const getProducto = async (req, res) => {
    try {
      console.log(req.params.id)
        const producto = await Producto.findById(req.params.id)
        if (!producto) return res.status(404).json({ message: "Task no found" })
        res.json(producto)

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }

}


export const deleteProducto = async (req, res) => {
  try {
    // Busca y actualiza el producto
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },             // Cambia el estado a inactivo
      { new: true }                  // Devuelve el documento actualizado
    );

    // Si no se encontró el producto
    if (!producto) {
      return res.status(404).json(["Producto no encontrado"]);
    }

    // Devuelve una respuesta exitosa
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const activarProducto = async (req, res) => {
  try {
    // Busca y actualiza el producto
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: true },             // Cambia el estado a inactivo
      { new: true }                  // Devuelve el documento actualizado
    );

    // Si no se encontró el producto
    if (!producto) {
      return res.status(404).json(["Producto no encontrado"]);
    }

    // Devuelve una respuesta exitosa
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!producto) return res.status(404).json(["Producto no found"])
        res.json(producto)

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }

}