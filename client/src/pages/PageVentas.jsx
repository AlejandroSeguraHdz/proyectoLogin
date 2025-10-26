// src/pages/PageVentas.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useVenta } from "../context/Venta.context"; // usa tu contexto actual

// Helpers para normalizar datos
const getId = (v) => v._id?.$oid ?? v._id ?? v.id ?? "";
const getDate = (v) => {
  const raw = v.createdAt?.$date ?? v.createdAt ?? v.fecha ?? null;
  if (!raw) return "";
  try { return new Date(raw).toLocaleString("es-MX"); } catch { return String(raw); }
};
const formatMoney = (n) => Number(n || 0).toFixed(2);

// Componente pequeño para mostrar items en una tabla
function VentaItemsTable({ items }) {
  if (!items || items.length === 0) return <div className="text-sm text-gray-400">Sin items</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left bg-zinc-800">
            <th className="px-2 py-1">SKU</th>
            <th className="px-2 py-1">Nombre</th>
            <th className="px-2 py-1">Precio unitario</th>
            <th className="px-2 py-1">Cantidad</th>
            <th className="px-2 py-1">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-t border-zinc-700">
              <td className="px-2 py-1">{it.sku}</td>
              <td className="px-2 py-1">{it.nombre}</td>
              <td className="px-2 py-1">${formatMoney(it.precioUnitario ?? it.precio ?? it.precioUnit)}</td>
              <td className="px-2 py-1">{it.cantidad}</td>
              <td className="px-2 py-1">${formatMoney(it.subtotal ?? (it.precioUnitario * it.cantidad))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PageVentas() {
  const { ventas, getVentas, guardarVenta } = useVenta();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [expanded, setExpanded] = useState(null); // id expandida
  const [modalId, setModalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // cargar ventas al montar
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await getVentas();
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las ventas.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filtro cliente simple
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ventas || [];
    return (ventas || []).filter((v) => {
      const id = getId(v);
      const itemsTxt = (v.items || []).map((it) => `${it.sku ?? ""} ${it.nombre ?? ""}`).join(" ");
      return [id, v.metodoPago ?? "", v.estado ?? "", itemsTxt].join(" ").toLowerCase().includes(q);
    });
  }, [ventas, query]);

  const totalPages = Math.max(1, Math.ceil((filtered || []).length / perPage));
  const pageItems = (filtered || []).slice((page - 1) * perPage, page * perPage);

  const toggleExpand = (id) => setExpanded((cur) => (cur === id ? null : id));

  const openModal = (id) => setModalId(id);
  const closeModal = () => setModalId(null);

  const changeEstado = async (id, nuevo) => {
    // Aquí podrías llamar a API. Por ahora hacemos cambio local optimista.
    setError(null);
    try {
      // si tu endpoint existe, llámalo aquí
      // await updateEstadoVentaRequest(id, nuevo)
      // actualizar localmente:
      // (si getVentas recarga, mejor llamar al endpoint y recargar)
      const idx = (ventas || []).findIndex((v) => getId(v) === id);
      if (idx !== -1) {
        ventas[idx].estado = nuevo;
        // Forzar re-render simple — si tu contexto actualiza estado con setVentas, úsalo desde el context.
        await getVentas(); // alternativa: recargar
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el estado.");
    }
  };

  // Export CSV (opcional)
  const exportCSV = () => {
    const rows = [["id", "fecha", "metodo", "estado", "total", "items"]];
    (ventas || []).forEach((v) => {
      const id = getId(v);
      const fecha = v.createdAt?.$date ?? v.createdAt ?? "";
      const metodo = v.metodoPago ?? "";
      const estado = v.estado ?? "";
      const total = Number(v.total ?? 0).toFixed(2);
      const items = (v.items || []).map((it) => `${it.sku}:${it.nombre}:${it.cantidad}`).join("|");
      rows.push([id, fecha, metodo, estado, total, items]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-semibold">Ventas realizadas</h2>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Buscar por id, producto, estado o método"
            className="px-3 py-2 border rounded bg-white/5"
            aria-label="Buscar ventas"
          />
          <button onClick={exportCSV} className="px-3 py-2 bg-indigo-600 text-white rounded">Exportar CSV</button>
          <button onClick={() => { setLoading(true); getVentas().finally(() => setLoading(false)); }} className="px-3 py-2 border rounded">Actualizar</button>
        </div>
      </div>

      {error && <div className="mb-2 text-red-500">{error}</div>}

      <div className="overflow-x-auto bg-zinc-900 rounded p-2 text-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-300">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Método</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">Cargando...</td></tr>
            ) : pageItems.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">No hay ventas.</td></tr>
            ) : pageItems.map((v) => {
              const id = getId(v);
              const fecha = getDate(v);
              const itemsCount = (v.items || []).reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0);
              const expandedRow = expanded === id;
              return (
                <React.Fragment key={id}>
                  <tr className="border-t">
                    <td className="px-3 py-2 max-w-xs truncate">{id}</td>
                    <td className="px-3 py-2">{fecha}</td>
                    <td className="px-3 py-2">{v.metodoPago}</td>
                    <td className="px-3 py-2">{itemsCount}</td>
                    <td className="px-3 py-2">${formatMoney(v.total)}</td>
                    <td className="px-3 py-2">{v.estado}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button onClick={() => toggleExpand(id)} className="px-2 py-1 border rounded"> {expandedRow ? "Ocultar" : "Ver items"} </button>
                      <button onClick={() => openModal(id)} className="px-2 py-1 border rounded">Detalle</button>
                      <select defaultValue={v.estado} onChange={(e) => changeEstado(id, e.target.value)} className="px-2 py-1 border rounded">
                        <option value="pendiente">pendiente</option>
                        <option value="completado">completado</option>
                        <option value="cancelado">cancelado</option>
                      </select>
                    </td>
                  </tr>

                  {/* fila expandible: items */}
                  {expandedRow && (
                    <tr>
                      <td colSpan={7} className="px-3 py-2 bg-zinc-800">
                        <VentaItemsTable items={v.items} />
                        <div className="mt-2 text-right">
                          <div>Subtotal: ${formatMoney(v.subtotal)}</div>
                          <div>Impuesto: ${formatMoney(v.impuesto)}</div>
                          <div>Descuento: ${formatMoney(v.descuento)}</div>
                          <div className="font-bold">Total: ${formatMoney(v.total)}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación simple */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Mostrando {(filtered.length === 0) ? 0 : (page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} de {filtered.length}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded">Anterior</button>
          <div className="px-3 py-1 border rounded">{page} / {totalPages}</div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded">Siguiente</button>
        </div>
      </div>

      {/* Modal detalle */}
      {modalId && (() => {
        const venta = (ventas || []).find((x) => getId(x) === modalId);
        if (!venta) return null;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded max-w-3xl w-full p-4 text-black relative">
              <button onClick={closeModal} className="absolute top-3 right-3 px-2 py-1 border rounded">Cerrar</button>
              <h3 className="text-lg font-semibold mb-2">Venta {getId(venta)}</h3>
              <div className="mb-2 text-sm text-gray-600">Creada: {getDate(venta)}</div>
              <div className="mb-2">Método: {venta.metodoPago}</div>
              <div className="mb-4">Total: ${formatMoney(venta.total)}</div>
              <VentaItemsTable items={venta.items} />
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => window.print()} className="px-3 py-2 border rounded">Imprimir</button>
                <button onClick={() => { /* ejemplo: descargar PDF o marcar completada */ }} className="px-3 py-2 bg-indigo-600 text-white rounded">Acción</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default PageVentas