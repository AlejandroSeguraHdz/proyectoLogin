import { Router } from "express";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { esquemaRegistrarProducto } from "../schemas/Productos.esquema.js";
import { activarProducto, crearProducto, deleteProducto, getProducto, getProductos, getProductosDesactivados, updateProducto } from "../controllers/productos.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
const router =Router()
router.post('/producto',authRequired,crearProducto)
router.get('/producto',authRequired,getProductos)
router.get('/producto/:id',authRequired,getProducto)
router.delete('/producto/:id',authRequired,deleteProducto)
router.put('/producto/:id',authRequired,validateSchema(esquemaRegistrarProducto),updateProducto)


router.get('/productos-desactivados',authRequired,getProductosDesactivados)
router.delete('/activar-producto/:id',authRequired,activarProducto)


export default router;
