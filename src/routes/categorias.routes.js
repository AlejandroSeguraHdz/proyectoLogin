import { Router } from "express";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { esquemaRegistrarCategoria } from "../schemas/Categoria.esquema.js";
import { createCategoria, deleteCategoria, getCategoria, getCategorias, updateCategoria } from "../controllers/categorias.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
const router =Router()
router.post('/categoria',authRequired,createCategoria)
router.get('/categoria',authRequired,getCategorias)
router.get('/categoria/:id',authRequired,getCategoria)
router.delete('/categoria/:id',authRequired,deleteCategoria)
router.put('/categoria/:id',authRequired,validateSchema(esquemaRegistrarCategoria),updateCategoria)


 

export default router;
