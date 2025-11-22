import Producto from "../models/productos.model.js";
import Log from "../models/Log.model.js";
import  Movimiento  from "../models/MovimientosProdutos.model.js";

// Importaciones necesarias para manejar archivos en disco
import fs from 'fs';
import path from 'path';

// --- FUNCIONES AUXILIARES PARA MANEJO DE ARCHIVOS ---
// Definimos las funciones auxiliares para que estén disponibles en este controlador
const getFilePath = (relativePath) => {
    // path.resolve() asegura que la ruta sea absoluta desde la raíz del proyecto
    return path.join(path.resolve(), relativePath);
};

const deleteFileIfExists = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            //console.log(`Archivo eliminado: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error al intentar eliminar el archivo ${filePath}:`, err);
    }
};
// ----------------------------------------------------


export const crearProducto = async (req, res) => {
    try {
        const {  nombre, descripcion, codigo, precio, cantidad, categoria } = req.body;

        // Verificar si ya existe el SKU
        const productFound = await Producto.findOne({ codigo });
        if (productFound) return res.status(400).json(["Codigo ya registrado"]);

    // Obtener la ruta del archivo si Multer lo ha guardado en disco
    let imagenPath = undefined;
    let imagenMimeType = undefined;

    if (req.file) {
        // Multer con diskStorage almacena el archivo y nos da la ruta temporal
        // Usamos req.file.filename para construir la ruta relativa que guardaremos en DB
        imagenPath = `/uploads/${req.file.filename}`;
        imagenMimeType = req.file.mimetype || "image/png";
        
       // console.log("DEBUG: Archivo guardado en disco. Ruta relativa:", imagenPath);
    }

    const nuevoProducto = new Producto({
            codigo,

     nombre,
      descripcion,
      precio,
      cantidad,
      categoria,
      imagen: imagenPath, // Guardamos la RUTA (string)
      imagenMimeType: imagenMimeType, // Guardamos el MIME Type
    });


    const npr = await nuevoProducto.save();
/*
    await Log.create({
      tipo: "Creación de producto",
      descripcion: `Se creó el producto "${npr.nombre}" con ID ${npr._id}`,
    });*/

    await Movimiento.create({
        producto:npr._id,
        tipo: "Alta",
        cantidad: npr.cantidad,
        cantidadAnterior: 0,
        cantidadNueva:  npr.cantidad
    });


    res.status(201).json(npr);
  } catch (error) {
    console.error("Error en crearProducto:", error);
    // Si falla la subida a DB, intentar eliminar el archivo que Multer ya guardó.
    if (req.file) {
        deleteFileIfExists(req.file.path); 
    }
    res.status(500).json({ error });
  }
};


export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar producto actual
    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json(["Producto no found"]);
    
    const productoSku = await Producto.findOne({ sku: req.body.sku });

    if(productoSku && req.body.sku == productoSku.sku )
    {
        if(producto.id != productoSku.id)
        {
            res.status(400).json(["SKU ya registrado por otro producto"]);
        }
    }
    
    if (req.file) {
      // Si el producto anterior tenía una imagen, intentamos borrarla del disco
      if (producto.imagen && typeof producto.imagen === "string") {
        const oldPath = getFilePath(producto.imagen);
        deleteFileIfExists(oldPath);
      }

      // Asignar la nueva ruta y el MIME type
      producto.imagen = `/uploads/${req.file.filename}`;
      producto.imagenMimeType = req.file.mimetype || "image/png";
    }

    // Actualizar campos (si vienen en req.body)
    const fields = ["sku", "nombre", "descripcion", "codigo", "precio", "cantidad", "activo", "categoria"];
    fields.forEach((f) => {
      if (typeof req.body[f] !== "undefined") {
        producto[f] = req.body[f];
      }
    });

    const saved = await producto.save();

    
    await Movimiento.create({
        producto:npr._id,
        tipo: "Actualizacion",
        cantidad: saved.cantidad,
        cantidadAnterior: 0,
        cantidadNueva:  npr.cantidad
    });

    res.json(saved);
  } catch (error) {
    console.error("Error en updateProducto:", error);
    return res.status(500).json({ message: error.message });
  }
};
export const getProductos = async (req, res) => {
  try {
    // Traer todos los productos activos
   /// const productos = await Producto.find({ activo: true });
    const productos = await Producto.find({ activo: true }).populate("categoria", "nombre codigo");
     // Preparar la respuesta: leer el archivo de imagen para cada producto
    const productosConImagen = productos.map(producto => {
      return prepareProductResponse(producto);
    });

    // Como prepareProductResponse es síncrona, esperamos todos los resultados
    res.json(productosConImagen);

  } catch (error) {
    console.error("Error en getProductos:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getProductosDesactivados = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: false });
    
    const productosConImagen = productos.map(producto => {
      return prepareProductResponse(producto);
    });
    
    res.json(productosConImagen);
  } catch (error) {
    console.error("Error en getProductosDesactivados:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getProducto = async (req, res) => {
  try {
     const producto = await Producto.findById(req.params.id).populate("categoria", "nombre codigo");
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    
    const productoFinal = prepareProductResponse(producto);
   // console.log(productoFinal)
    res.json(productoFinal);
    
  } catch (error) {
    console.error("Error en getProducto:", error);
    return res.status(500).json({ message: error.message });
  }
};


// NUEVA FUNCIÓN AUXILIAR para leer el archivo de disco y generar la Data URL
const prepareProductResponse = (producto) => {
    // Convertir el documento de Mongoose a un objeto simple para añadir la imagen
    const productoObj = producto.toObject ? producto.toObject() : producto;
    
    let imagenDataUrl = null;
    // Verificar si hay una ruta de imagen guardada en el campo 'imagen'
    if (productoObj.imagen && typeof productoObj.imagen === "string") {
        const filePath = getFilePath(productoObj.imagen); // Obtener la ruta absoluta
        
        try {
            // Leer el archivo de forma síncrona
            const buffer = fs.readFileSync(filePath);

            // Generar la Data URL
            const mime = productoObj.imagenMimeType || "image/png";
            imagenDataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
            
            // DEBUG: 
            console.log(`DEBUG: Imagen leída de disco (${productoObj.imagen}). Tamaño: ${buffer.length} bytes.`);
            
        } catch (err) {
            console.warn(`WARN: No se pudo leer el archivo de imagen en la ruta: ${filePath}. Error: ${err.message}`);
            // Si el archivo no existe en disco, simplemente no se envía la imagen.
        }
    }

    // Devolver el objeto modificado, eliminando el campo de imagen original
    // y añadiendo la data URL.
    delete productoObj.imagen; 
    productoObj.imagen = imagenDataUrl;

    return productoObj;
};


// controllers/producto.controller.js (o donde tengas la función)
export const getProductoXCodigo = async (req, res) => {
  try {
     // usar findOne para traer un solo documento
    const producto = await Producto.findOne({ codigo: req.params.codigo });
     if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    
    // Usamos la función auxiliar para leer el archivo de disco y preparar la respuesta
    const productoFinal = prepareProductResponse(producto);
     // responder sólo los campos necesarios (incluye imagenDataUrl o null)
    res.json(productoFinal);

  } catch (err) {
    console.error("Error en getProductoXCodigo:", err);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

export const deleteProducto = async (req, res) => {
  try {
  
    
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
  }
};

export const activarProducto = async (req, res) => {
  try {
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
  }
};


export const ajustarInventario = async (req, res) => {

   try {
        const { codigo, cantidad, nuevaCantidad,comentarios } = req.body;

        // Verificar datos mínimos
        if (!codigo || nuevaCantidad === undefined) {
            return res.status(400).json({ message: "Faltan datos" });
        }
        
        // Buscar producto por código
        const producto = await Producto.findOne({ codigo });

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

    

        // Actualizar cantidad
        producto.cantidad = nuevaCantidad;

        await producto.save();


        await Movimiento.create({
        producto:producto._id,
        tipo: "Inventario",
        cantidadAnterior: cantidad,
        cantidadNueva:  nuevaCantidad,
        comentarios:comentarios
    });


        res.status(200).json({
            message: "Producto actualizado correctamente",
            producto,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
}
