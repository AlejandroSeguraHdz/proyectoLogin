// routes/productos.routes.js
import { Router } from "express";
 import upload from "../middlewares/upload.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { esquemaRegistrarProducto } from "../schemas/Productos.esquema.js";
import {
  activarProducto,
  crearProducto,
  deleteProducto,
  getProducto,
  getProductos,
  getProductosDesactivados,
  updateProducto,
  getProductoXCodigo,
  ajustarInventario
} from "../controllers/productos.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

 // routes/productos.routes.js (ejemplo)


 
router.post("/producto", upload.single("imagen"), crearProducto);
router.put("/producto/:id", upload.single("imagen"), updateProducto);

 
router.get("/producto", authRequired, getProductos);
router.get("/producto/:id", authRequired, getProducto);
router.delete("/producto/:id", authRequired, deleteProducto);

router.put(
  "/producto/:id",
  authRequired,
  upload.single("imagen"),                  // procesar imagen (opcional) antes de validar
  validateSchema(esquemaRegistrarProducto),
  updateProducto
);

router.get("/productos-desactivados", authRequired, getProductosDesactivados);
router.delete("/activar-producto/:id", authRequired, activarProducto);

router.get("/producto-codigo/:codigo", authRequired, getProductoXCodigo);


router.post("/inventario",  ajustarInventario);

export default router;
