import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import taskRoutes from "./routes/task.routes.js"
import rutasProductos from "./routes/productos.routes.js"
import { FRONTEND_URL } from "./config.js";

const app = express()
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  }))
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use("/api",authRoutes)
app.use("/api",taskRoutes)
app.use("/api",rutasProductos)


export default app;