import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProducto } from "../context/Producto.context";
import { useCarrito } from "../context/Carrito.context";

function PageCompras() {
  const { carrito, addProducto, updateCantidad, removeProducto, clearCart, total } = useCarrito();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { codigo: "", cantidad: 1 },
  });
  const { getProductoXCodigo } = useProducto();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const codigo = data.codigo?.trim();
      let cantidad = Number(data.cantidad) || 1;
      if (!codigo) return;

      // buscamos producto
      const p = await getProductoXCodigo(codigo);
      const producto = Array.isArray(p) ? p[0] : p;

      if (!producto) {
        alert("Producto no encontrado: " + codigo);
        return;
      }

      // Si producto.cantidad es el stock, lo usamos; si no, ajusta la propiedad
      const stock = Number(producto.cantidad ?? 0);
      if (stock <= 0) {
        alert("Producto sin stock disponible.");
        return;
      }

      if (cantidad > stock) {
        // opcional: preguntar si agregar hasta stock
        if (!window.confirm(`Solo hay ${stock} en stock. ¿Agregar ${stock} en lugar de ${cantidad}?`)) {
          return;
        }
        cantidad = stock;
      }

      addProducto(producto, cantidad);
      reset();
    } catch (err) {
      console.error(err);
      alert("Error buscando producto.");
    }
  });

  return (
    <div className="p-4 text-white">
      <form onSubmit={onSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Código del producto"
          {...register("codigo")}
          className="w-1/2 bg-zinc-700 px-4 py-2 rounded-md"
        />
        <input
          type="number"
          min="1"
          {...register("cantidad", { valueAsNumber: true })}
          className="w-20 bg-zinc-700 px-4 py-2 rounded-md"
        />
        <button type="submit" className="bg-green-600 px-4 py-2 rounded-md">
          Agregar
        </button>
        <button type="button" onClick={() => clearCart()} className="bg-rose-600 px-4 py-2 rounded-md">
          Vaciar
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">🛒 Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-400">No hay productos en el carrito.</p>
      ) : (
        <div className="overflow-x-auto bg-zinc-800 rounded-md p-2">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2">Código</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Cantidad</th>
                <th className="px-3 py-2">Subtotal</th>
                <th className="px-3 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => {
                const codigo = item.codigo;
                const precio = Number(item.precio) || 0;
                const cantidadEnCarrito = Number(item.cantidadEnCarrito) || 0;
                const stock = Number(item.stock) || 0;
                return (
                  <tr key={codigo} className="border-t border-zinc-700">
                    <td className="px-3 py-2 align-top">{codigo}</td>
                    <td className="px-3 py-2 align-top">{item.nombre}</td>
                    <td className="px-3 py-2 align-top">{precio.toFixed(2)}</td>
                    <td className="px-3 py-2 align-top">{stock}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        max={stock}
                        value={cantidadEnCarrito}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          // si intenta pasar de stock, lo capamos y opcionalmente avisamos
                          if (val > stock) {
                            alert(`Máximo disponible: ${stock}`);
                            updateCantidad(codigo, stock);
                          } else {
                            updateCantidad(codigo, val);
                          }
                        }}
                        className="w-20 bg-zinc-700 px-2 py-1 rounded"
                      />
                    </td>
                    <td className="px-3 py-2 align-top">{(precio * cantidadEnCarrito).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => removeProducto(codigo)}
                        className="bg-red-600 px-3 py-1 rounded text-white"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="px-3 py-2 text-right font-semibold">Total:</td>
                <td className="px-3 py-2 font-semibold">{Number(total).toFixed(2)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export default PageCompras;
