import { useForm } from "react-hook-form"
import { useProducto } from "../context/Producto.context";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);


function FormProductos() {

    const { register, setValue, handleSubmit } = useForm()
    const { createProducto, getOnlyOneProducto,updateProducto } = useProducto()
    const navigate = useNavigate()
    const params = useParams()

    const onSubmit = handleSubmit((data) => {
        if (params.id) {
            updateProducto(params.id,{
                ...data,
                precio: parseFloat(data.precio), 
                cantidad: parseInt(data.cantidad),
            })
            navigate("/producto")
        }
        else {
            createProducto({
                ...data,
                precio: parseFloat(data.precio), 
                cantidad: parseInt(data.cantidad),
            });
            navigate("/producto")
        }
    })
    
    
        useEffect(() => {
            const loadProducto = async () => {
                if (params.id) {
                    const producto = await getOnlyOneProducto(params.id)
                    setValue('sku', producto.sku)
                    setValue('nombre', producto.nombre)
                    setValue('descripcion', producto.descripcion)
                    setValue('precio', producto.precio)
                    setValue('cantidad', producto.cantidad)
                }
            }
            loadProducto()
    
        }, [])
    return (

        <div className=" flex h-[calc(100vh-100px)] items-center justify-center" >
            <div className=" bg-zinc-800 max-w-md  w-full p-10 rounded-md">
                <form onSubmit={onSubmit}>
                    <label htmlFor="sku"> SKU</label>
                    <input
                        type="text"
                        placeholder="SKU"
                        {...register("sku")}
                        autoFocus
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

                    <label htmlFor="nombre"> Nombre</label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        {...register("nombre")}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

                    <label htmlFor="descripcion"> Descripcion</label>
                    <input
                        type="text"
                        placeholder="descripcion"
                        {...register('descripcion')}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

                    <label htmlFor="precio"> Precio</label>
                    <input
                        type="number"
                        step="0.01"     // permite decimales hasta 2 cifras
                        placeholder="Precio"
                        {...register("precio")}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

                    <label htmlFor="cantidad"> Cantidad</label>
                    <input
                        type="number"
                        placeholder="Cantidad"
                        {...register("cantidad")}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />
                    <button
                        className="bg-indigo-500 px-3 py-2 rounded-md">
                        Save
                    </button>
                </form>
            </div>
        </div>
    )

}

export default FormProductos