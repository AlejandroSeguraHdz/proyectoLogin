import { createContext, useContext, useState } from "react";
import { createProductoRequest, deleteProductoRequest, getProductosRequest, getProductoRequest, updateProductoRequest, getProductosDesactivadosRequest, activarProductoRequest } from "../api/Producto";
const ProductoContext = createContext();

export const useProducto = () => {
    try {
        const context = useContext(ProductoContext);
    
   if (!context) {
        throw new Error("useTask must be used widthin a TaskProvider")
    }
    return context;
        
    } catch (error) {
        console.log("errores de useProducto",error)
    }
}

export function ProductoProvider({ children }) {
    const [productos, setProductos] = useState([]);

    const createProducto = async (producto) => {
    {
            try {
                console.log(producto)
                const res = await createProductoRequest(producto)
             } catch (error) {
                console.log(error)

            }
        }
    }

    const getProductos = async () => {
        try {
            const res = await getProductosRequest()
             setProductos(res.data)
        } catch (error) {
            console.log(error)
        }
    }

        const getProductosDesactivados = async () => {
        try {
            const res = await getProductosDesactivadosRequest()
            console.log(res)
             setProductos(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    const deleteProducto = async (id) => {

        try {
            const res = await deleteProductoRequest(id)
            if (res.status == 204) setProductos(productos.filter(prducto => prducto._id != id))
        } catch (error) {
            console.log(error)
        }

    }

    
    const activarProducto = async (id) => {

        try {
            const res = await activarProductoRequest(id)
            if (res.status == 204) setProductos(productos.filter(prducto => prducto._id != id))
        } catch (error) {
            console.log(error)
        }

    }
    const getOnlyOneProducto = async (id) => {
        try {
            const res = await getProductoRequest(id)
            return res.data

        } catch (error) {
            console.log(error)

        }
    }
    const updateProducto = async (id, producto) => {
        try {
             await updateProductoRequest(id, producto);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ProductoContext.Provider
            value={{
                productos,
                createProducto,
                getProductos,
                deleteProducto,
                getOnlyOneProducto,
                updateProducto,
                getProductosDesactivados,
                activarProducto
            }}
        >
            {children}
        </ProductoContext.Provider>
    )
}