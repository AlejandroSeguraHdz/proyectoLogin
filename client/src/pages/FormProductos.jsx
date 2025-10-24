import { useForm } from "react-hook-form"
import { useProducto } from "../context/Producto.context";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc";
import { useCategoria } from "../context/Categoria.context";
dayjs.extend(utc);

function FormProductos() {
  const { register, setValue, handleSubmit, watch } = useForm()
  const { createProducto, getOnlyOneProducto, updateProducto, producto } = useProducto()
  const { getCategorias, categorias } = useCategoria();

  const navigate = useNavigate()
  const params = useParams()
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const watchImagen = watch("imagen") // para preview inmediato

  useEffect(() => {
    const loadProducto = async () => {
      getOnlyOneProducto(params.id)

      if (params.id) {
        await getOnlyOneProducto(params.id)
        setValue('sku', producto.sku)
        setValue('nombre', producto.nombre)
        const catValue = producto.categoria && (producto.categoria._id ? producto.categoria._id : producto.categoria)
        setValue('categoria', catValue)        
        setValue('descripcion', producto.descripcion)
        setValue('precio', producto.precio)
        setValue('cantidad', producto.cantidad)
        setValue('codigo', producto.codigo)
        if (producto.imagen) {
          // suponiendo que producto.imagen es la ruta relativa o url completa
          setCurrentImageUrl(producto.imagen)
        }
      }
    }
    loadProducto()
    getCategorias()
  }, [])



  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    // Construir FormData
    const formData = new FormData()
    formData.append("sku", data.sku ?? "")
    formData.append("nombre", data.nombre ?? "")
    formData.append("categoria", data.categoria ?? "")
    formData.append("descripcion", data.descripcion ?? "")
    formData.append("precio", parseFloat(data.precio || 0))
    formData.append("cantidad", parseInt(data.cantidad || 0))
    formData.append("codigo", data.codigo ?? "")

    // Si hay un archivo seleccionado (data.imagen es FileList)
    if (data.imagen && data.imagen.length > 0) {
      formData.append("imagen", data.imagen[0])
    }

    try {
      if (params.id) {
        await updateProducto(params.id, formData) // modificar en el contexto para aceptar FormData
        navigate("/producto")
      } else {
        await createProducto(formData) // modificar en el contexto para aceptar FormData
         navigate("/producto")
      }
    } catch (error) {
      console.error(error)
      // mostrar notificación de error si quieres
    }
  })

  // Preview local del archivo seleccionado (no subirlo)
  const selectedFile = watchImagen && watchImagen.length > 0 ? watchImagen[0] : null
  const localPreviewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null

  return (
    <div className=" flex h-[calc(100vh-100px)] items-center justify-center" >
      <div className=" bg-zinc-800 max-w-md  w-full p-10 rounded-md">
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <label htmlFor="sku"> SKU</label>
          <input type="text" placeholder="SKU" {...register("sku")} autoFocus className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

          <label htmlFor="nombre"> Nombre</label>
          <input type="text" placeholder="Nombre" {...register("nombre")} className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

          <label htmlFor="categoria">Categoría</label>
          <select
            {...register("categoria")}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          >
            <option value="">Seleccione una categoría</option>
            {Array.isArray(categorias) &&
              categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
          </select>
          <label htmlFor="codigo"> Codigo</label>
          <input type="text" placeholder="Codigo" {...register("codigo")} className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

          <label htmlFor="descripcion"> Descripcion</label>
          <input type="text" placeholder="descripcion" {...register('descripcion')} className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

          <label htmlFor="precio"> Precio</label>
          <input type="number" step="0.01" placeholder="Precio" {...register("precio")} className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

          <label htmlFor="cantidad"> Cantidad</label>
          <input type="number" placeholder="Cantidad" {...register("cantidad")} className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

          <label htmlFor="imagen"> Imagen</label>
          <input type="file" accept="image/*" {...register("imagen")} className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

          {/* Preview: si hay preview local, mostrarlo; si no, mostrar la imagen actual del producto */}
          {localPreviewUrl ? (
            <img src={localPreviewUrl} alt="preview" className="w-40 h-40 object-cover rounded-md my-2" />
          ) : currentImageUrl ? (
            <img src={currentImageUrl} alt="actual" className="w-40 h-40 object-cover rounded-md my-2" />
          ) : null}

          <button className="bg-indigo-500 px-3 py-2 rounded-md">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormProductos
