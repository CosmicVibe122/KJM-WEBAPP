import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    // ❌ Asegúrate de que este div NO esté envuelto en <Router> aquí
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <BarraNavegacion /> 
      
      <div className="flex-grow-1">
        <Routes>
          {/* Rutas principales y de productos */}
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<ListaProductos />} />
          <Route path="/categoria/:idCategoria" element={<ListaProductos />} />
          <Route path="/carrito" element={<Carrito />} />
          
          {/* RUTA DE PAGO (Checkout) */}
          <Route path="/checkout" element={<Checkout />} /> 
          
          {/* Rutas de Información */}
          <Route path="/nosotros" element={<Nosotros />} /> 
          <Route path="/contacto" element={<Contacto />} /> 
          
          {/* Rutas de Usuario y Admin */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={<Inicio />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App;