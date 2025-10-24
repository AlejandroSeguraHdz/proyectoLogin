import { Link } from "react-router-dom";
   
function CategoriaCard({ categoria }) {
 
    return (
        <div className="bg-zinc-800 max-w-md w-full p-6 rounded-md">
            <header className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    {/* Imagen pequeña tipo icono */}
                    <img
                        src="https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-icono-producto-signo-creativo-la-colecci%C3%B3n-iconos-control-calidad-plano-relleno-para-ordenador-y-m%C3%B3vil-logotipo-150923733.jpg" 
                        alt={categoria.nombre}
                        className="w-20 h-20 object-cover rounded-full"
                    />
                    

                    
                </div>

                <div className="flex gap-x-2">
                    <button
                        className="bg-red-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                     >
                        Desactivar
                    </button>

                    <Link
                        className="bg-blue-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        to={`/producto-configurar/${categoria._id}`}
                    >
                        Edit
                    </Link>
                </div>
            </header>
            <h1 className="text-2xl font-bold text-white">{categoria.nombre}</h1>
            <div className="grid grid-cols-2">
             <p className="text-slate-300"> Codigo: {categoria.codigo}</p>
            </div>
        </div>
    );
}

export default CategoriaCard;
