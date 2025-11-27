import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Alert, Button, Collapse, ListGroup, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function MisCompras() {
    const { usuario } = useAuth();
    const [boletas, setBoletas] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [expanded, setExpanded] = useState({});
    const [cargandoDetalle, setCargandoDetalle] = useState({});
    const [errorDetalle, setErrorDetalle] = useState({});

    useEffect(() => {
        async function cargar() {
            try {
                const res = await fetch('http://localhost:8080/api/boletas');
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                const filtered = usuario
                    ? data.filter(b => {
                        const rawId = b.usuario?.id ?? b.usuarioId ?? b.usuario_id;
                        const uidMatch = rawId != null && String(rawId) === String(usuario.id);
                        const emailMatch = b.usuario?.email && b.usuario.email === usuario.email;
                        return uidMatch || emailMatch;
                    })
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
                                    <th>Usuario</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boletas.map((b) => (
                                    <React.Fragment key={b.id}>
                                        <tr>
                                            <td>{b.numero || b.id}</td>
                                            <td>{b.fecha ? new Date(b.fecha).toLocaleString('es-CL') : '-'}</td>
                                            <td>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(b.total || 0)}</td>
                                            <td>{Array.isArray(b.detalles) ? b.detalles.reduce((acc, d) => acc + (d.cantidad || 0), 0) : 0}</td>
                                            <td>{b.usuario?.id ?? b.usuarioId ?? '-'}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={async () => {
                                                        const willExpand = !expanded[b.id];
                                                        setExpanded(prev => ({ ...prev, [b.id]: willExpand }));
                                                        if (willExpand && (!Array.isArray(b.detalles) || b.detalles.length === 0)) {
                                                            try {
                                                                setErrorDetalle(prev => ({ ...prev, [b.id]: undefined }));
                                                                setCargandoDetalle(prev => ({ ...prev, [b.id]: true }));
                                                                const res = await fetch(`http://localhost:8080/api/boletas/${b.id}`);
                                                                if (res.status === 404) {
                                                                    setBoletas(prev => prev.map(x => x.id === b.id ? { ...x, detalles: [] } : x));
                                                                } else if (!res.ok) {
                                                                    throw new Error(`Error ${res.status}`);
                                                                } else {
                                                                    const data = await res.json();
                                                                    const detalles = Array.isArray(data.detalles) ? data.detalles : [];
                                                                    setBoletas(prev => prev.map(x => x.id === b.id ? { ...x, detalles } : x));
                                                                }
                                                            } catch (err) {
                                                                setErrorDetalle(prev => ({ ...prev, [b.id]: 'No se pudo cargar el detalle.' }));
                                                            } finally {
                                                                setCargandoDetalle(prev => ({ ...prev, [b.id]: false }));
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {expanded[b.id] ? 'Ocultar' : 'Ver'}
                                                </Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6}>
                                                <Collapse in={!!expanded[b.id]}>
                                                    <div>
                                                        {cargandoDetalle[b.id] ? (
                                                            <div className="py-3 text-center text-muted">
                                                                <Spinner animation="border" size="sm" className="me-2" /> Cargando detalle...
                                                            </div>
                                                        ) : errorDetalle[b.id] ? (
                                                            <Alert variant="danger" className="my-2">{errorDetalle[b.id]}</Alert>
                                                        ) : (Array.isArray(b.detalles) && b.detalles.length > 0) ? (
                                                            <ListGroup>
                                                                {b.detalles.map((d, idx) => {
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
                                                        ) : (
                                                            <div className="py-3 text-center text-muted">Sin detalles disponibles.</div>
                                                        )}
                                                    </div>
                                                </Collapse>
                                            </td>
                                        </tr>
                                    </React.Fragment>
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
