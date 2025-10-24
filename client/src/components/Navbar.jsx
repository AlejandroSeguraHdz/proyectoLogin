import { Link } from "react-router-dom"
import { useAuth } from "../context/Auth.context"

function NavBar() {
    const { isAuthenticated, logOut, user } = useAuth()
    return (
        <nav className=" bg-zinc-700 my-3 flex justify-between py-5 px-10">
            <Link to="/">
                <h1 className="text-2xl font-bold">Gestor de Inventario</h1>
            </Link>
            <ul className="flex gap-x-2">
                {isAuthenticated ? (
                    <>
                        <li>
                            Bienvenido {user.nombres}
                        </li>



                        <li>
                            <Link to='/Producto'
                                className="bg-indigo-500 px-4 py-1 rounded-sd"> Inventario</Link>
                        </li>
                          <li>
                            <Link to='/usuarios'
                                className="bg-indigo-500 px-4 py-1 rounded-sd"> Usuarios</Link>
                        </li>
                          <li>
                            <Link to='/compras'
                                className="bg-indigo-500 px-4 py-1 rounded-sd"> Compra</Link>
                        </li>
                     
                     
                        
                        <li>
                            <Link onClick={() => { logOut() }}
                                className="bg-indigo-500 px-4 py-1 rounded-sd"> Log out</Link>
                        </li>

                    </>
                ) : (

                    <>
                        <li>
                            <Link to='/login'
                                className="bg-indigo-500 px-4 py-1 rounded-sd"> Login</Link>
                        </li>
                    
                    </>
                )
                }

            </ul>
        </nav>
    )
}

export default NavBar