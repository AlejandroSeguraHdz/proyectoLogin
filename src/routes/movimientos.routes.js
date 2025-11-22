import { Router } from "express";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { getMovimientos, } from "../controllers/movimientos.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
const router =Router()


router.get('/movimientos/:id',authRequired,getMovimientos)
 
 

export default router;
