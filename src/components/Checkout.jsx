import React, { useState, useEffect } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { CartX } from 'react-bootstrap-icons';

function Checkout() {
    const { carrito, total, vaciarCarrito } = useCarrito();
    const { usuario } = useAuth();
    const navigate = useNavigate();

    // 1. Inicialización de Estado (Pre-carga de datos del usuario logueado)
    const [datosCliente, setDatosCliente] = useState(() => {
        if (usuario) {
            const nombreCompleto = usuario.nombre || '';
            const partesNombre = nombreCompleto.split(' ');

            return {
                nombre: partesNombre.length > 0 ? partesNombre[0] : '',
                apellido: partesNombre.length > 1 ? partesNombre.slice(1).join(' ') : '',
                email: usuario.email || '',
                telefono: usuario.telefono || '',
                direccion: usuario.direccion || '',
                ciudad: '', region: '', codigoPostal: '', comentarios: ''
            };
        }
        return {
            nombre: '', apellido: '', email: '', telefono: '', direccion: '',
            ciudad: '', region: '', codigoPostal: '', comentarios: ''
        };
    });

    const [metodoPago, setMetodoPago] = useState('credito');
    const [compraFinalizada, setCompraFinalizada] = useState(false);
    const [alerta, setAlerta] = useState(null);

    // --- UTILITIES ---
    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
    };

    const subtotal = total;

    // 2. Redirigir si el carrito está vacío
    useEffect(() => {
        if (carrito.length === 0 && !compraFinalizada) {
            const timer = setTimeout(() => navigate('/productos'), 100);
            return () => clearTimeout(timer);
        }
    }, [carrito, navigate, compraFinalizada]);

    const handleClienteChange = (e) => {
        const { name, value } = e.target;
        setDatosCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleFinalizarCompra = async (e) => {
        e.preventDefault();
        setAlerta(null);

        if (total === 0) {
            setAlerta({ variant: 'warning', message: 'El carrito está vacío.' });
            return;
        }

        // --- PREPARACIÓN DE DATOS PARA LA API (según BoletaController) ---
        const boletaPayload = {
            usuario: usuario ? { id: usuario.id } : undefined,
            detalles: carrito.map(item => ({
                producto: { id: item.id },
                cantidad: item.cantidad
            }))
        };

        try {
            // Enviar boleta al backend
            const res = await fetch('/api/boletas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(boletaPayload)
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `Error ${res.status} al generar boleta`);
            }

            const boleta = await res.json();

            // Acciones de éxito
            setCompraFinalizada(true);
            vaciarCarrito();

            // 🔑 NAVEGAR A LA PÁGINA DE CONFIRMACIÓN (pasando los datos)
            navigate('/confirmacion', {
                state: {
                    orderDetails: {
                        cliente: datosCliente,
                        productos: carrito.map(item => ({
                            id: item.id,
                            nombre: item.nombre,
                            cantidad: item.cantidad,
                            precioUnitario: item.precio
                        })),
                        metodoPago: metodoPago,
                        total: boleta.total,
                        numeroBoleta: boleta.numero || boleta.id,
                        fecha: boleta.fecha
                    }
                },
                replace: true
            });

        } catch (error) {
            console.error("Fallo al enviar boleta:", error);
            // Mostrar mensaje de stock insuficiente u otros errores
            const message = (error.message || '').includes('No hay suficiente stock')
                ? error.message
                : 'Error al procesar la compra. Inténtalo de nuevo.';
            setAlerta({ variant: 'danger', message });
            
        }
    };

    


    if (carrito.length === 0 && !compraFinalizada) {
        return <div className="text-center my-5"><CartX size={50} /> <p>Redirigiendo, el carrito está vacío.</p></div>;
    }

    // Muestra un mensaje de éxito si la compra se finalizó
    if (compraFinalizada) {
        return (
            <Container className="my-5 text-center">
                <Alert variant="success" className="p-4">
                    <h3>✅ ¡Compra Finalizada con Éxito!</h3>
                    <p>Tu pedido ha sido procesado y será enviado a la brevedad. Gracias por elegir KJM Sports.</p>
                    <Button variant="outline-success" onClick={() => navigate('/')}>Volver al Inicio</Button>
                </Alert>
            </Container>
        );
    }


    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Finalizar Compra</h2>

            {alerta && <Alert variant={alerta.variant}>{alerta.message}</Alert>}

            <Form onSubmit={handleFinalizarCompra}>
                <Row>
                    {/* --- Columna Izquierda: Información del Cliente y Pago --- */}
                    <Col md={7}>
                        <Card className="shadow-sm mb-4">
                            <Card.Body>
                                <h4 className="mb-3">Información del Cliente</h4>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group><Form.Label>Nombre</Form.Label>
                                            <Form.Control type="text" name="nombre" value={datosCliente.nombre} onChange={handleClienteChange} placeholder="Nombre" />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group><Form.Label>Apellido</Form.Label>
                                            <Form.Control type="text" name="apellido" value={datosCliente.apellido} onChange={handleClienteChange} placeholder="Apellido" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Group><Form.Label>Email</Form.Label>
                                            <Form.Control type="email" name="email" value={datosCliente.email} onChange={handleClienteChange} placeholder="Email" />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group><Form.Label>Teléfono</Form.Label>
                                            <Form.Control type="text" name="telefono" value={datosCliente.telefono} onChange={handleClienteChange} placeholder="+56 9 1234 5678" />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h4 className="mb-3 mt-4">Dirección de Entrega</h4>
                                <Form.Group className="mb-3"><Form.Label>Dirección</Form.Label>
                                    <Form.Control type="text" name="direccion" value={datosCliente.direccion} onChange={handleClienteChange} placeholder="Calle, número, depto/casa" />
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={5}>
                                        <Form.Group><Form.Label>Ciudad</Form.Label>
                                            <Form.Control type="text" name="ciudad" value={datosCliente.ciudad} onChange={handleClienteChange} placeholder="Ciudad" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group><Form.Label>Región</Form.Label>
                                            <Form.Control type="text" name="region" value={datosCliente.region} onChange={handleClienteChange} placeholder="Región" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group><Form.Label>Cód. Postal</Form.Label>
                                            <Form.Control type="text" name="codigoPostal" value={datosCliente.codigoPostal} onChange={handleClienteChange} placeholder="12345" />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Comentarios de Entrega</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="comentarios" value={datosCliente.comentarios} onChange={handleClienteChange} placeholder="Ej: Tocar timbre 2 veces, entregar en conserjería, etc." />
                                </Form.Group>

                                <h4 className="mb-3 mt-4">Método de Pago</h4>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Form.Check
                                            type="radio"
                                            label="Tarjeta de Crédito / Débito"
                                            name="metodoPago"
                                            value="credito"
                                            checked={metodoPago === 'credito'}
                                            onChange={(e) => setMetodoPago(e.target.value)}
                                        />
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Check
                                            type="radio"
                                            label="Transferencia Bancaria"
                                            name="metodoPago"
                                            value="transferencia"
                                            checked={metodoPago === 'transferencia'}
                                            onChange={(e) => setMetodoPago(e.target.value)}
                                        />
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Form.Check
                                            type="radio"
                                            label="Pago en Efectivo (contra entrega)"
                                            name="metodoPago"
                                            value="efectivo"
                                            checked={metodoPago === 'efectivo'}
                                            onChange={(e) => setMetodoPago(e.target.value)}
                                        />
                                    </ListGroup.Item>
                                </ListGroup>

                            </Card.Body>
                        </Card>
                    </Col>

                    {/* --- Columna Derecha: Resumen del Pedido --- */}
                    <Col md={5}>
                        <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
                            <Card.Body>
                                <h4 className="mb-3">Resumen del Pedido</h4>
                                <ListGroup variant="flush">
                                    {carrito.map(item => (
                                        <ListGroup.Item key={item.id} className="d-flex justify-content-between">
                                            <div>
                                                <span className="fw-bold">{item.nombre}</span><br />
                                                <small className="text-muted">{item.cantidad} x {formatoMoneda(item.precio)}</small>
                                            </div>
                                            <span className="fw-bold">{formatoMoneda(item.precio * item.cantidad)}</span>
                                        </ListGroup.Item>
                                    ))}

                                    <ListGroup.Item className="d-flex justify-content-between bg-light">
                                        <span>Subtotal ({carrito.length} {carrito.length === 1 ? 'producto' : 'productos'}):</span>
                                        <span>{formatoMoneda(subtotal)}</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between">
                                        <span>Envío:</span>
                                        <span className="text-success fw-bold">GRATIS</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="d-flex justify-content-between fw-bold text-success">
                                        <span>Total:</span>
                                        <span>{formatoMoneda(total)}</span>
                                    </ListGroup.Item>
                                </ListGroup>

                                <Button type="submit" variant="success" size="lg" className="w-100 mt-4">
                                    Confirmar y Pagar {formatoMoneda(total)}
                                </Button>
                                {/* Botón de simulación eliminado */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default Checkout;