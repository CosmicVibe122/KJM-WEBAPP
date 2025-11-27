import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Alert, Button, Collapse, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function MisCompras() {
    const { usuario } = useAuth();
    const [boletas, setBoletas] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        async function cargar() {
            try {
                const res = await fetch('http://localhost:8080/api/boletas');
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                // Intentar filtrar por usuario si el backend lo incluye
                const filtered = usuario
                    ? data.filter(b => (b.usuario?.id ?? b.usuarioId) === usuario.id)
                    : data;
                setBoletas(Array.isArray(filtered) ? filtered : []);
            } catch (e) {
                setError(e.message);
            } finally {
                setCargando(false);
            }
        }
        cargar();
    }, [usuario]);

    if (!usuario) {
        return (
            <Container className="my-5">
                <Alert variant="warning">Debes iniciar sesión para ver tus compras.</Alert>
            </Container>
        );
    }

    if (cargando) {
        return (
            <Container className="my-5">
                <Alert variant="info">Cargando tus compras...</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-light">
                    <h4 className="mb-0">Mis Compras</h4>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {boletas.length === 0 ? (
                        <Alert variant="secondary">No tienes compras registradas.</Alert>
                    ) : (
                        <Table hover responsive className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>#</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Productos</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boletas.map((b) => (
                                    <>
                                        <tr key={b.id}>
                                            <td>{b.numero || b.id}</td>
                                            <td>{b.fecha ? new Date(b.fecha).toLocaleString('es-CL') : '-'}</td>
                                            <td>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(b.total || 0)}</td>
                                            <td>{Array.isArray(b.detalles) ? b.detalles.reduce((acc, d) => acc + (d.cantidad || 0), 0) : 0}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => setExpanded(prev => ({ ...prev, [b.id]: !prev[b.id] }))}
                                                >
                                                    {expanded[b.id] ? 'Ocultar' : 'Ver'}
                                                </Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={5}>
                                                <Collapse in={!!expanded[b.id]}>
                                                    <div>
                                                        <ListGroup>
                                                            {(b.detalles || []).map((d, idx) => {
                                                                const nombre = d.producto?.nombre ?? d.nombre ?? `Producto ${idx + 1}`;
                                                                const precio = d.producto?.precio ?? d.precioUnitario ?? 0;
                                                                const cantidad = d.cantidad ?? 0;
                                                                const subtotal = precio * cantidad;
                                                                return (
                                                                    <ListGroup.Item key={`${b.id}-${idx}`} className="d-flex justify-content-between">
                                                                        <div>
                                                                            <span className="fw-bold">{nombre}</span>
                                                                            <br />
                                                                            <small className="text-muted">{cantidad} x {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)}</small>
                                                                        </div>
                                                                        <span className="fw-bold">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(subtotal)}</span>
                                                                    </ListGroup.Item>
                                                                );
                                                            })}
                                                        </ListGroup>
                                                    </div>
                                                </Collapse>
                                            </td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    <div className="d-flex gap-2 mt-3">
                        <Button variant="primary" href="/productos">Seguir Comprando</Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default MisCompras;
