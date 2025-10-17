

function tarjetaProducto({ product }) {
    const {
        sku,
        nombre,
        descripcion,
        precio,
        cantidad,
        activo,
    } = product;


    const money = (value) => {
        // Manejo seguro por si viene null/undefined
        const val = typeof value === "number" ? value : Number(value);
        if (Number.isNaN(val)) return "-";
        return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(val);
    };


    return (
        <article className="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
            <div className="flex items-start gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
                    Imagen
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">{nombre}</h3>
                    <p className="text-xs text-gray-500">SKU: <span className="font-mono">{sku}</span></p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{descripcion || "Sin descripción"}</p>
                </div>
            </div>


            <div className="mt-4 flex items-center justify-between gap-2">
                <div>
                    <div className="text-sm text-gray-500">Precio</div>
                    <div className="font-medium text-gray-900">{money(precio)}</div>
                </div>


                <div className="text-right">
                    <div className="text-sm text-gray-500">Stock</div>
                    <div className={`font-medium ${cantidad > 0 ? "text-green-600" : "text-red-600"}`}>{cantidad}</div>
                </div>


                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>


            <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 rounded-md border border-gray-200 text-sm hover:bg-gray-50">Ver</button>
                <button className="py-2 px-4 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Editar</button>
            </div>
        </article>
    );
}

export default tarjetaProducto