import { Routes, Route, Navigate } from 'react-router-dom';
// 🔑 Importaciones de COMPONENTES (la ruta correcta es relativa a src)
import BarraNavegacion from "./components/BarraNavegacion.jsx";
import ListaProductos from "./components/ListaProductos.jsx";
import Inicio from "./components/Inicio.jsx";
import Footer from "./components/Footer.jsx";
import Carrito from "./components/Carrito.jsx";
import Login from "./components/Login.jsx";
import Registro from "./components/Registro.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import Nosotros from "./components/Nosotros.jsx";
import Contacto from "./components/Contacto.jsx";
import Checkout from "./components/Checkout.jsx"; // Componente de Checkout
import ConfirmacionCompra from "./components/ConfirmacionCompra.jsx";
import { useAuth } from './context/AuthContext.jsx';
import MiPerfil from "./components/MiPerfil.jsx";
import MisCompras from "./components/MisCompras.jsx";

function App() {
  const { usuario } = useAuth();

  const AdminGuard = ({ children }) => {
    if (usuario === undefined) return null; // esperar hidratación
    if (!usuario || (usuario.rol !== 'ADMIN' && usuario.rol !== 'VENDEDOR')) {
      return <Navigate to="/productos" replace />;
    }
    return children;
  };

  const ClientGuard = ({ children }) => {
    if (usuario === undefined) return null;
    // Permitir que ADMIN acceda a todas las vistas de la tienda.
    // Solo restringir a VENDEDOR hacia el panel.
    if (usuario && usuario.rol === 'VENDEDOR') {
      return <Navigate to="/admin" replace />;
    }
    return children;
  };
  return (
    // ❌ Asegúrate de que este div NO esté envuelto en <Router> aquí
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <BarraNavegacion />

      <div className="flex-grow-1">
        <Routes>
          {/* Rutas principales y de productos */}
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<ClientGuard><ListaProductos /></ClientGuard>} />
          <Route path="/categoria/:idCategoria" element={<ListaProductos />} />
          <Route path="/carrito" element={<ClientGuard><Carrito /></ClientGuard>} />

          {/* RUTA DE PAGO (Checkout) */}
          <Route path="/checkout" element={<ClientGuard><Checkout /></ClientGuard>} />
          <Route path="/confirmacion" element={<ClientGuard><ConfirmacionCompra /></ClientGuard>} />

          {/* Rutas de Información */}
          <Route path="/nosotros" element={<ClientGuard><Nosotros /></ClientGuard>} />
          <Route path="/contacto" element={<ClientGuard><Contacto /></ClientGuard>} />

          {/* Rutas de Usuario y Admin */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<MiPerfil />} />
          <Route path="/mis-compras" element={<MisCompras />} />
          <Route path="/admin" element={<AdminGuard><AdminPanel /></AdminGuard>} />

          {/* Ruta de fallback */}
          <Route path="*" element={<Inicio />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App;