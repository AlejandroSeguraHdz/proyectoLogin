// src/pages/PageCompras.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProducto } from "../context/Producto.context";
import { useCarrito } from "../context/Carrito.context";

function PageCompras() {
  const { carrito, addProducto, updateCantidad, removeProducto, clearCart, total, totalItems, guardarVenta } = useCarrito();
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { codigo: "", cantidad: 1, metodoPago: "efectivo" },
  });
  const { getProductoXCodigo } = useProducto();

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const codigo = data.codigo?.trim();
      let cantidad = Number(data.cantidad) || 1;
      if (!codigo) return;

      const p = await getProductoXCodigo(codigo);
      const producto = Array.isArray(p) ? p[0] : p;

      if (!producto) {
        alert("Producto no encontrado: " + codigo);
        return;
      }

      const stock = Number(producto.cantidad ?? 0);
      if (stock <= 0) {
        alert("Producto sin stock disponible.");
        return;
      }

      if (cantidad > stock) {
        if (!window.confirm(`Solo hay ${stock} en stock. ¿Agregar ${stock} en lugar de ${cantidad}?`)) {
          return;
        }
        cantidad = stock;
      }

      addProducto(producto, cantidad);
      reset({ codigo: "", cantidad: 1, metodoPago: watch("metodoPago") });
    } catch (err) {
      console.error(err);
      alert("Error buscando producto.");
    }
  });

  const buildCartItemsForVenta = () => {
    return carrito
      .map((it) => {
        const productoId = (it.raw && (it.raw._id || it.raw.id)) || it._id || it.productoId || null;
        const cantidad = Number(it.cantidadEnCarrito ?? it.cantidad ?? 0);
        const precioUnitario = Number(it.precio || 0);
        return productoId
          ? {
              productoId,
              sku: it.raw?.sku || it.codigo || "",
              nombre: it.nombre || "Sin nombre",
              precioUnitario,
              cantidad,
              subtotal: precioUnitario * cantidad,
            }
          : null;
      })
      .filter(Boolean);
  };

  const handleCheckout = async () => {
    setErrorMsg(null);
    setCheckoutResult(null);

    if (!carrito || carrito.length === 0) {
      setErrorMsg("El carrito está vacío.");
      return;
    }

    const metodoPago = watch("metodoPago") || "efectivo";

    // Validación cantidades
    for (const it of carrito) {
      const stock = Number(it.stock ?? (it.raw && it.raw.cantidad) ?? 0);
      const qty = Number(it.cantidadEnCarrito ?? it.cantidad ?? 0);
      if (qty <= 0) {
        setErrorMsg(`Cantidad inválida para ${it.nombre || it.codigo}`);
        return;
      }
      if (qty > stock) {
        setErrorMsg(`Cantidad solicitada para ${it.nombre || it.codigo} supera el stock (${stock}).`);
        return;
      }
    }

    const items = buildCartItemsForVenta();
    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
    const impuesto = 0; // puedes calcular si aplica
    const descuento = 0; // puedes calcular si aplica
    const totalVenta = subtotal + impuesto - descuento;

    const datosVenta = {
      items,
      subtotal,
      impuesto,
      descuento,
      total: totalVenta,
      metodoPago,
      pagoRef: null, // por completar según método de pago
      notas: "",     // opcional
    };

    try {
      setLoadingCheckout(true);
      await guardarVenta(datosVenta); // envío al context
      setCheckoutResult({ success: true }); // puedes reemplazar con respuesta real
      clearCart();
    } catch (err) {
      console.error("Error en guardar venta:", err);
      setErrorMsg("Error al procesar la venta.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  useEffect(() => {
    console.log("Carrito:", carrito);
  }, [carrito]);

  return (
    <div className="p-4 text-white">
      <form onSubmit={onSubmit} className="mb-6 flex gap-2 flex-wrap">
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

      <div className="mb-4">
        <label className="mr-2">Método de pago:</label>
        <select {...register("metodoPago")} className="bg-zinc-700 px-2 py-1 rounded text-black">
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <h2 className="text-lg font-semibold mb-2">🛒 Carrito</h2>

      {errorMsg && <div className="mb-2 text-red-400">{errorMsg}</div>}
      {checkoutResult && (
        <div className="mb-2 p-2 bg-green-800 rounded">
          <strong>Venta creada correctamente</strong>
        </div>
      )}

      {carrito.length === 0 ? (
        <p className="text-gray-400">No hay productos en el carrito.</p>
      ) : (
        <>
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
                  <td colSpan="5" className="px-3 py-2 text-right font-semibold">
                    Total:
                  </td>
                  <td className="px-3 py-2 font-semibold">{Number(total).toFixed(2)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={handleCheckout}
              disabled={loadingCheckout}
              className="bg-indigo-600 px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loadingCheckout ? "Procesando..." : `Pagar (${totalItems || 0} items)`}
            </button>

            <button onClick={() => clearCart()} className="bg-rose-600 px-4 py-2 rounded-md">
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PageCompras;
