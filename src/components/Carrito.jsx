import React from 'react';

import Container from 'react-bootstrap/Container';

import Table from 'react-bootstrap/Table';

import Button from 'react-bootstrap/Button';

import { Trash } from 'react-bootstrap-icons';

import { useCarrito } from '../context/CarritoContext';

import { Link } from 'react-router-dom'; // 🔑 Importamos Link para la navegación



function Carrito() {

  // Asumo que las funciones en CarritoContext son: eliminarProducto, vaciarCarrito, total, etc.

  const { carrito, eliminarProducto, vaciarCarrito, total } = useCarrito();



  const formatoMoneda = (valor) => {

    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);

  };



  // --- 1. Renderizado si está vacío ---

  if (carrito.length === 0) {

    return (

      <Container className="mt-5 text-center py-5">

        <div className="mb-4">

            <h1 style={{ fontSize: '5rem' }}>🛒</h1>

        </div>

        <h2 className="mb-3">Tu carrito está vacío</h2>

        <p className="text-muted mb-4">Parece que aún no has agregado productos.</p>

        <Link to="/productos">

          <Button variant="dark" size="lg" className="rounded-pill px-5">Ir a Comprar</Button>

        </Link>

      </Container>

    );

  }



  // --- 2. Renderizado con productos ---

  return (

    <Container className="mt-5 mb-5">

      <h2 className="mb-4 fw-bold">Tu Carrito de Compras</h2>

      

      <div className="shadow-sm rounded border overflow-hidden">

        <Table responsive hover className="align-middle mb-0 bg-white">

            <thead className="bg-light">

            <tr>

                <th className="py-3 ps-4">Producto</th>

                <th className="py-3">Precio</th>

                <th className="py-3 text-center">Cant.</th>

                <th className="py-3">Subtotal</th>

                <th className="py-3 text-center">Eliminar</th>

            </tr>

            </thead>

            <tbody>

            {carrito.map((item) => (

                <tr key={item.id}>

                <td className="ps-4">

                    <div className="d-flex align-items-center">

                        <img 

                            src={item.imagenUrl} 

                            alt={item.nombre} 

                            style={{ width: '60px', height: '60px', objectFit: 'contain', marginRight: '15px' }}

                            className="rounded border p-1"

                            onError={(e) => { e.target.src = 'https://placehold.co/60'; }}

                        />

                        <div className="d-flex flex-column">

                            <span className="fw-bold">{item.nombre}</span>

                            <small className="text-muted">{item.categoria?.nombre || 'General'}</small>

                        </div>

                    </div>

                </td>

                <td>{formatoMoneda(item.precio)}</td>

                <td className="text-center">

                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">

                        {item.cantidad}

                    </span>

                </td>

                <td className="fw-bold text-success">{formatoMoneda(item.precio * item.cantidad)}</td>

                <td className="text-center">

                    <Button 

                        variant="outline-danger" 

                        size="sm" 

                        className="rounded-circle"

                        onClick={() => eliminarProducto(item.id)}

                        title="Eliminar producto"

                    >

                    <Trash />

                    </Button>

                </td>

                </tr>

            ))}

            </tbody>

        </Table>

      </div>



      {/* ZONA DE TOTALES Y BOTONES */}

      <div className="d-flex justify-content-between align-items-center mt-4 p-4 bg-light rounded shadow-sm flex-wrap gap-3">

        

        {/* GRUPO DE BOTONES IZQUIERDA */}

        <div className="d-flex gap-2">

            <Button variant="outline-secondary" onClick={vaciarCarrito}>

                Vaciar Carrito

            </Button>

            <Link to="/productos">

                <Button variant="outline-primary">

                    Seguir Comprando

                </Button>

            </Link>

        </div>



        {/* GRUPO DERECHA (TOTAL Y PAGAR) */}

        <div className="text-end">

            <h4 className="mb-2">Total: <span className="text-success fw-bold">{formatoMoneda(total)}</span></h4>

            

            <Link to="/checkout"> 

                <Button variant="dark" size="lg" className="px-5">

                    Ir a Pagar

                </Button>

            </Link>

        </div>

      </div>

    </Container>

  );

}

export default Carrito;