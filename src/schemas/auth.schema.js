import { z } from "zod";

export const registerSchema = z.object({
    noEmpleado: z.string({
        required_error: "Numero de empleado es requerido"
    }),
     nombres: z.string({
        required_error: "Los nombres son requeridos"
    }),
     apellidoP: z.string({
        required_error: "Apellido paterno es requerido"
    }),
     apellidoM: z.string({
        required_error: "Apellido materno es requerido"
    }),
    email: z.string({
        required_error: "Email is required",
    }).email({
        message: "Invalid email"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(6, {
        message: "Password must be at least 6 characters"
    })
});

export const loginSchema = z.object({
    noEmpleado: z.string({
        required_error: "Numero de empleado es requerido"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(6, {
        message: "Password must be at least 6 characters"
    })
});
