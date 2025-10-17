import { BrowserRouter, Routes, Route } from "react-router-dom"
import RegisterPage from "./pages/RegisterPage"

import { AuthProvider } from "./context/Auth.context"
import TaskPage from "./pages/TaskPage"
import TaskFormPage from "./pages/TaskFormPage"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./protectetRoute"
import LoginPage from "./pages/LoginPage"
import { TaskProvider } from "./context/Task.context"
import NavBar from "./components/Navbar"
import PaginaProducto from "./pages/PaginaProducto"
import { ProductoProvider } from "./context/Producto.context"
import FormProductos from "./pages/FormProductos"
import PaginaProductosDesactivados from "./pages/PaginaProductosDesactivados"
function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <ProductoProvider>
          <BrowserRouter>
            <main className="container mx-auto px-10">
              <NavBar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />


                <Route element={<ProtectedRoute />}>
                  <Route path="/task" element={<TaskPage />} />
                  <Route path="/add-task" element={<TaskFormPage />} />
                  <Route path="/task/:id" element={<TaskFormPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/producto" element={<PaginaProducto />} />
                  <Route path="/add-producto" element={<FormProductos />} />
                  <Route path="/producto/:id" element={<FormProductos />} />
                  <Route path="/productos-desactivados" element={<PaginaProductosDesactivados />} />


                </Route>
              </Routes>
            </main>
          </BrowserRouter>
        </ProductoProvider>
      </TaskProvider>

    </AuthProvider>

  )
}

export default App


