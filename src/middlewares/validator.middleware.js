// src/middlewares/validator.middleware.js
import { ZodError } from "zod";

export const validateSchema = (schema) => (req, res, next) => {
  try {
    // Si schema.parse lanza ZodError lo atrapamos en catch
    schema.parse(req.body);

    return next();
  } catch (error) {
    // Si es error de Zod, extraemos sólo los mensajes en un array de strings
    if (error instanceof ZodError && Array.isArray(error.errors)) {
      const messages = error.errors.map((e) => e.message ?? String(e.message));
      return res.status(400).json(messages);
    }

    // Si no es ZodError, devolvemos un mensaje controlado y registramos el error
    console.error("Validation middleware unexpected error:", error);
    return res.status(400).json([
      (error && error.message) ? String(error.message) : "Invalid request",
    ]);
  }
};

