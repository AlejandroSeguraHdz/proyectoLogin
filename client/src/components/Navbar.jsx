import { Link } from "react-router-dom"
import { useAuth } from "../context/Auth.context"

function NavBar()
{
     const {isAuthenticated, logOut,user} =useAuth()
    return(
        <nav className=" bg-zinc-700 my-3 flex justify-between py-5 px-10">
            <Link to="/">
                <h1 className="text-2xl font-bold">Task Manager</h1>
            </Link>
            <ul className="flex gap-x-2">
                {isAuthenticated ? (
                    <>
                         <li>
                           Welcome {user.username}
                           </li>
                         <li>
                            <Link to='/task'
                            className="bg-indigo-500 px-4 py-1 rounded-sd"> View task</Link>
                        </li>
                          <li>
                            <Link to='/add-task'
                            className="bg-indigo-500 px-4 py-1 rounded-sd"> New task</Link>
                        </li>
                         <li>
                            <Link onClick={() => {logOut()}}
                            className="bg-indigo-500 px-4 py-1 rounded-sd"> Log out</Link>
                        </li>
                         <li>
                            <Link to='/Producto'
                            className="bg-indigo-500 px-4 py-1 rounded-sd"> Inventario</Link>
                        </li>
                        
                    </>
                ):(

                    <>
                        <li>
                            <Link to='/login'
                            className="bg-indigo-500 px-4 py-1 rounded-sd"> Login</Link>
                           </li>
                         <li
                         className="bg-indigo-500 px-4 py-1 rounded-sd">
                            <Link to='/register'> Register</Link>

                        </li>
                    </>
                )
               }    
                
            </ul>
        </nav>
    )
}

export default NavBar