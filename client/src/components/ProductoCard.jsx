import { Link } from "react-router-dom";
import { useTask } from "../context/Task.context";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useProducto } from "../context/Producto.context";
dayjs.extend(utc);

function ProductoCard({ producto }) {
      const { deleteProducto } = useProducto()
    
    // Construimos la URL o base64 de la imagen si existe
    const imagenSrc =
        producto.imagen && typeof producto.imagen === "string"
            ? producto.imagen.startsWith("data:")
                ? producto.imagen
                : `data:image/png;base64,${producto.imagen}`
            : "https://via.placeholder.com/150?text=Sin+imagen"; // imagen por defecto

    return (
        <div className="bg-zinc-800 w-full max-w-4xl p-6 rounded-md shadow-lg mx-auto">
            <header className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-4">
                    {/* Imagen del producto con ajuste automático */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-700 flex items-center justify-center">
                        <img
                            src={imagenSrc}
                            alt={producto.nombre}
                            className="w-full h-full object-contain"
                        />
                    </div>

                </div>

                <div className="flex  gap-2">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                        onClick={() => deleteProducto(producto._id)}
                    >
                        Desactivar
                    </button>

                    <Link
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center"
                        to={`/producto/${producto._id}`}
                    >
                        Editar
                    </Link>
                </div>
            </header>

            <div className="text-slate-300 space-y-1">
                <h1 className="text-2xl font-bold text-white">{producto.nombre}</h1>
                <p><strong>SKU:</strong> {producto.sku || "Sin SKU"}</p>
                <p><strong>Categoría:</strong> {producto.categoria.nombre || "Sin categoría"}</p>
                <p><strong>Precio:</strong> {producto.precio || "Sin categoría"}</p>
                <p><strong>Cantidad:</strong> {producto.cantidad || "Sin categoría"}</p>

            </div>
        </div>
    );
}

export default ProductoCard;
