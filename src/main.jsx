import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Estilos globales y de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'

import { BrowserRouter } from 'react-router-dom';
// Importamos los proveedores de Contexto
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext'; // <--- 1. IMPORTAR EL AUTH PROVIDER

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. ENVOLVER LA APP: AuthProvider debe ir por fuera para manejar la sesión global */}
      <AuthProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)