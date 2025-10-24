import User from "../models/user.model.js";
// Importaciones necesarias para manejar archivos en disco
 

 


export const crearUsuario = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si ya existe el SKU
        const productFound = await User.findOne({ username });
        if (productFound) return res.status(400).json(["Usuario ya registradp"]);
    const nuevoUsuario = new User({
    username,
    email,
      password,
     
    });
    const nu = await nuevoUsuario.save();
    res.status(201).json(nu);
  } catch (error) {
    console.error("Error en usuario:", error);
;
  }
};


export const updateUsuario  = async (req, res) => {
  try {
       const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!producto) return res.status(404).json(["Producto no found"])
        res.json(producto)
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getUsuarios = async (req, res) => {
  try {
    // Traer todos los productos activos
   /// const productos = await Producto.find({ activo: true });
    const usuarios = await User.find( )
 
   
    res.json(usuarios);

  } catch (error) {
     return res.status(500).json({ message: error.message });
  }
};



export const getUsuario = async (req, res) => {
  try {
     const usuario = await User.findById(req.params.id)
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    
 
    res.json(usuario);
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
 
 
export const deleteUsuario = async (req, res) => {
 /* try {
  
    
    // 3. Desactivar el producto en la base de datos (soft delete)
    const productoDesactivado = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false }, // Opcional: limpiar la referencia en DB
      { new: true }
    );

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error en deleteProducto:", error);
    return res.status(500).json({ message: error.message });
  }*/
};

export const activarUsuario = async (req, res) => {
 /* try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: true },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json(["Producto no encontrado"]);
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error en activarProducto:", error);
    return res.status(500).json({ message: error.message });
  }*/
};
