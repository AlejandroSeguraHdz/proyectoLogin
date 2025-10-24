import { z } from "zod";

export const esquemaRegistrarCategoria = z.object({
    codigo: z.string({
        required_error: "Codigo es requerido"
    }),
    nombre: z.string({
        required_error: "Nombre es requerido"
    }),
     descripcion: z.string({
        required_error: "Descripcion es requerida"
    }),
     
});
