import React, { useState } from 'react';
import { Container, Card, Row, Col, ListGroup, Button, Alert } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';

function ConfirmacionCompra() {
    // Usamos useLocation para obtener los datos pasados desde Checkout
    const location = useLocation();
    const { orderDetails } = location.state || {};

    // 🔑 CORRECCIÓN: Generar y guardar el ID de la orden una sola vez
    const [orderId] = useState(() => {
        if (orderDetails?.numeroBoleta) return orderDetails.numeroBoleta;
        const randomNum = Math.floor(Math.random() * 900000) + 100000;
        return `KJM-${randomNum}-422`;
    });

    // Función de ayuda para formatear moneda y fecha
    const formatoMoneda = (valor) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);

    const fechaFormateada = (orderDetails?.fecha
        ? new Date(orderDetails.fecha)
        : new Date()).toLocaleString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

    if (!orderDetails) {
        return (
            <Container className="my-5 text-center">
                <Alert variant="danger">
                    Error: No se encontraron detalles de la orden.
                    <Link to="/productos" className="d-block mt-2">Volver a Comprar</Link>
                </Alert>
            </Container>
        );
    }

    // Desestructurar datos clave
    const { cliente, productos, metodoPago, total } = orderDetails;

    // Lógica para imprimir
    const handlePrint = () => {
        window.print();
    };

    return (
        <Container className="my-5">
            <Card className="shadow-lg border-0">
                <Card.Header className="bg-success text-white text-center p-4">
                    <h3>✅ ¡Pago Exitoso!</h3>
                    <p className="mb-0">Tu orden ha sido procesada correctamente.</p>
                </Card.Header>
                <Card.Body className="p-5">

                    <h4 className="mb-4">Detalles de la Orden</h4>

                    <Row className="mb-4 small text-muted">
                        <Col md={6}>
                            <strong>Número de Orden:</strong><br />
                            <span className="text-primary fw-bold">{orderId}</span>
                        </Col>
                        <Col md={6} className="text-end">
                            <strong>Fecha:</strong><br />
                            {fechaFormateada}
                        </Col>
                    </Row>

                    {/* Información del Cliente */}
                    <div className="mb-4 border-top pt-3">
                        <h5 className="fw-bold">Cliente:</h5>
                        {cliente.nombre} {cliente.apellido} <br />
                        {cliente.email} / {cliente.telefono}
                    </div>

                    {/* Dirección y Comentarios */}
                    <div className="mb-4">
                        <h5 className="fw-bold">Dirección de Entrega:</h5>
                        {cliente.direccion}, {cliente.ciudad}, {cliente.region}
                        {cliente.comentarios && <p className="mt-2 small text-muted">Comentarios de Entrega: {cliente.comentarios}</p>}
                    </div>

                    {/* Productos */}
                    <h5 className="fw-bold mb-3">Productos:</h5>
                    <ListGroup variant="flush" className="mb-4">
                        {productos.map((prod) => (
                            <ListGroup.Item key={prod.id} className="d-flex justify-content-between">
                                <span>{prod.nombre} x {prod.cantidad}</span>
                                <span className="fw-bold">{formatoMoneda((prod.precioUnitario || 0) * prod.cantidad)}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    {/* Método y Total */}
                    <Row>
                        <Col md={6}><h5 className="fw-bold">Método de Pago:</h5>{metodoPago}</Col>
                        <Col md={6} className="text-end">
                            <h4 className="fw-bold mb-0">Total: <span className="text-success">{formatoMoneda(total)}</span></h4>
                        </Col>
                    </Row>

                </Card.Body>
                <Card.Footer className="d-flex justify-content-center gap-3 p-3 bg-light">
                    <Link to="/productos">
                        <Button variant="primary">Seguir Comprando</Button>
                    </Link>
                    <Button variant="outline-secondary" onClick={handlePrint}>
                        Imprimir Orden 🖨️
                    </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default ConfirmacionCompra;