// routes/productos.routes.js
import { Router } from "express";
 import upload from "../middlewares/upload.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { esquemaRegistrarProducto } from "../schemas/Productos.esquema.js";
import { crearUsuario, deleteUsuario, getUsuario, getUsuarios, updateUsuario } from "../controllers/usuarios.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

 // routes/productos.routes.js (ejemplo)


 
router.post("/usuario", upload.single("imagen"), crearUsuario);
router.put("/usuario/:id", upload.single("imagen"), updateUsuario);

 
router.get("/usuario", authRequired, getUsuarios);
router.get("/usuario/:id", authRequired, getUsuario);
router.delete("/usuario/:id", authRequired, deleteUsuario);

router.put(
  "/usuario/:id",
  authRequired,
 // validateSchema(esquemaRegistrarProducto),
  updateUsuario
);



export default router;
