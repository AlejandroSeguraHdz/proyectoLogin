import { Router } from "express";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { esquemaRegistrarCategoria } from "../schemas/Categoria.esquema.js";
import { getVentas, guardarVenta } from "../controllers/ventas.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
const router =Router()


router.get('/venta',authRequired,getVentas)
router.post('/venta',authRequired,guardarVenta)
 
 

export default router;
