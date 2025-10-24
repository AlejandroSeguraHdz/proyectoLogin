import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import taskRoutes from "./routes/task.routes.js"
import rutasProductos from "./routes/productos.routes.js"
import rutasCategorias from "./routes/categorias.routes.js"
import rutasUsuario from "./routes/usuarios.routes.js"
import { FRONTEND_URL } from "./config.js";

const app = express()
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  }))

  app.use(express.json({
    limit: '10mb' // Acepta hasta 10 Megabytes de JSON.
}));

app.use(morgan("dev"))
//app.use(express.json())
app.use(express.urlencoded({
    limit: '10mb', // Acepta hasta 10 Megabytes de datos URL-encoded.
    extended: true
}));
app.use(cookieParser())

app.use("/api",authRoutes)
app.use("/api",taskRoutes)
app.use("/api",rutasProductos)
app.use("/api",rutasCategorias)
app.use("/api",rutasUsuario)

export default app;