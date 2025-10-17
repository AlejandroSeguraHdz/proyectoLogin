import { z } from "zod";

export const esquemaRegistrarProducto = z.object({
    sku: z.string({
        required_error: "SKU es requerido"
    }),
    nombre: z.string({
        required_error: "Nombre es requerido"
    }),
     descripcion: z.string({
        required_error: "Nombre es requerido"
    }),
     precio: z.number({
        required_error: "Nombre es requerido"
    }),
     cantidad: z.number({
        required_error: "Cantidad es requerida"
    }),
});
