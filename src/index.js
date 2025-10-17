import express from "express";
import { connectDB } from "./db.js"; // ✅ import con llaves
import app from "./app.js"

await connectDB();

app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000"));