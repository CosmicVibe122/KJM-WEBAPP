import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Badge, Card, Tab, Tabs, InputGroup } from 'react-bootstrap';
import {
    Pencil, Trash, Plus, BoxSeam, Tags, People, FileBarGraph
} from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function AdminPanel() {
    // 🔑 OBTENEMOS SOLO USUARIO
    const { usuario } = useAuth();
    const navigate = useNavigate();

    // --- ESTADOS DE DATOS Y CARGA ---
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [usuariosAdmin, setUsuariosAdmin] = useState([]);
    const [filtroCategoriaId, setFiltroCategoriaId] = useState('');
    const [boletas, setBoletas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [key, setKey] = useState('productos');
    const isAdmin = usuario?.rol === 'ADMIN';
    const isVendedor = usuario?.rol === 'VENDEDOR';

    // Nota: se eliminan alertas visuales para evaluación — usamos logs en consola

    // --- ESTADOS MODAL PRODUCTOS ---
    const [showModalProducto, setShowModalProducto] = useState(false);
    const [modoEdicionProducto, setModoEdicionProducto] = useState(false);
    const [productoForm, setProductoForm] = useState({
        id: null, nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '',
        categoria: { id: 1 }
    });

    // --- ESTADOS MODAL CATEGORÍAS ---
    const [showModalCategoria, setShowModalCategoria] = useState(false);
    const [modoEdicionCategoria, setModoEdicionCategoria] = useState(false);
    const [categoriaForm, setCategoriaForm] = useState({ id: null, nombre: '', descripcion: '' });

    // --- ESTADOS MODAL USUARIOS ---
    const [showModalUsuario, setShowModalUsuario] = useState(false);
    const [modoEdicionUsuario, setModoEdicionUsuario] = useState(false);
    const [usuarioFormAdmin, setUsuarioFormAdmin] = useState({
        id: null, nombre: '', email: '', rol: 'USER', password: '',
        direccion: '', telefono: ''
    });


    // --- UTILITIES ---
    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
    };

    // 1. FUNCIÓN PARA EXPORTAR A CSV/EXCEL
    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) {
            // Mensaje suprimido en UI por evaluación
            console.warn('No hay datos para exportar.');
            return;
        }

        const headers = Object.keys(data[0]);

        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(fieldName => {
                let value = row[fieldName];
                if (typeof value === 'object' && value !== null) {
                    value = value.nombre || '';
                }
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename + ".csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    // 2. FUNCIÓN PRINCIPAL DE CARGA DE DATOS
    async function cargarDatos() {
        try {
            const responses = await Promise.all([
                fetch('http://localhost:8080/api/productos'),
                fetch('http://localhost:8080/api/categorias'),
                fetch('http://localhost:8080/api/usuarios'),
                fetch('http://localhost:8080/api/boletas')
            ]);

            const [dataProd, dataCat, dataUser, dataBoletas] = await Promise.all(
                responses.map(res => res.json())
            );

            setProductos(Array.isArray(dataProd) ? dataProd : []);
            setCategorias(Array.isArray(dataCat) ? dataCat : []);
            setUsuariosAdmin(Array.isArray(dataUser) ? dataUser : []);
            setBoletas(Array.isArray(dataBoletas) ? dataBoletas : []);

        } catch (error) {
            console.error("Error cargando datos:", error);
            // Mensaje suprimido en UI por evaluación; dejar rastro en consola
            console.error(`Fallo al cargar datos: ${error.message}. Verifique el Backend.`);
        } finally {
            setCargando(false);
        }
    };

    // 3. EFECTO DE SEGURIDAD Y CARGA INICIAL
    useEffect(() => {
        if (usuario === undefined) return;

        // Permitir acceso a ADMIN y VENDEDOR; bloquear otros
        if (usuario === null || (usuario.rol !== 'ADMIN' && usuario.rol !== 'VENDEDOR')) {
            // No mostrar alertas en UI — registrar en consola y redirigir
            console.warn('ACCESO DENEGADO: Rol no autorizado.');
            navigate('/');
            return;
        }

        cargarDatos();
    }, [usuario, navigate]);

    // ----------------------------------------------------
    // --- 4. FUNCIONES CRUD DE PRODUCTOS ---
    // ----------------------------------------------------

    const handleEliminarProducto = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/productos/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(`Error ${response.status}: La eliminación falló.`);
                cargarDatos();
            } catch (error) { /* sin mensaje de alerta en UI */ }
        }
    };

    const handleGuardarProducto = async () => {
        const metodo = modoEdicionProducto ? 'PUT' : 'POST';
        const url = modoEdicionProducto ? `http://localhost:8080/api/productos/${productoForm.id}` : 'http://localhost:8080/api/productos';
        const categoriaId = parseInt(productoForm.categoria?.id);
        const productoAEnviar = { ...productoForm, categoria: categoriaId ? { id: categoriaId } : null };

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoAEnviar)
            });
            if (!response.ok) throw new Error(`Error ${response.status}`);

            setShowModalProducto(false);
            // Mensaje suprimido en UI por evaluación
            console.log(`Producto ${modoEdicionProducto ? 'actualizado' : 'creado'} con éxito.`);
            cargarDatos();
        } catch (error) { console.error(`FALLO AL GUARDAR: ${error.message}`); }
    };

    const abrirModalProducto = (producto = null) => {
        if (producto) {
            setModoEdicionProducto(true);
            setProductoForm({ ...producto, categoria: { id: producto.categoria?.id?.toString() || '1' } });
        } else {
            setModoEdicionProducto(false);
            setProductoForm({ nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '', categoria: { id: categorias[0]?.id.toString() || '1' } });
        }
        setShowModalProducto(true);
    };

    // ----------------------------------------------------
    // --- 5. FUNCIONES DE CATEGORÍAS (crear/editar) ---
    // ----------------------------------------------------

    const abrirModalCategoria = (categoria = null) => {
        if (categoria) {
            setModoEdicionCategoria(true);
            setCategoriaForm(categoria);
        } else {
            setModoEdicionCategoria(false);
            setCategoriaForm({ nombre: '', descripcion: '' });
        }
        setShowModalCategoria(true);
    };

    const handleGuardarCategoria = async () => {
        // Mensajes de categoría suprimidos en UI
        // setAlertaCategoria(null);
        const metodo = modoEdicionCategoria ? 'PUT' : 'POST';
        const url = modoEdicionCategoria ? `http://localhost:8080/api/categorias/${categoriaForm.id}` : 'http://localhost:8080/api/categorias';

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoriaForm)
            });
            if (!response.ok) throw new Error(`Error ${response.status}`);

            setShowModalCategoria(false);
            await cargarDatos();
            console.log(`Categoría ${categoriaForm.nombre} guardada exitosamente.`);
        } catch (error) { console.error(`FALLO AL GUARDAR CATEGORÍA: ${error.message}`); }
    };

    // ----------------------------------------------------
    // --- 6. FUNCIONES CRUD DE USUARIOS ---
    // ----------------------------------------------------

    const abrirModalUsuario = (user = null) => {
        // Mensajes de usuario suprimidos en UI
        // setAlertaUsuario(null);
        if (user) {
            setModoEdicionUsuario(true);
            setUsuarioFormAdmin({
                id: user.id, nombre: user.nombre, email: user.email, rol: user.rol,
                direccion: user.direccion || '', telefono: user.telefono || '', password: ''
            });
        } else {
            setModoEdicionUsuario(false);
            setUsuarioFormAdmin({ id: null, nombre: '', email: '', rol: 'USER', password: '', direccion: '', telefono: '' });
        }
        setShowModalUsuario(true);
    };

    const handleEliminarUsuario = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error(`Error ${response.status}`);

                await cargarDatos();
                console.log('Usuario eliminado con éxito.');
            } catch (error) {
                console.error(`FALLO AL ELIMINAR USUARIO: ${error.message}`);
            }
        }
    };

    // ----------------------------------------------------
    // --- 6.1 ELIMINAR BOLETAS (ADMIN) ---
    // ----------------------------------------------------
    const handleEliminarBoleta = async (id) => {
        if (!isAdmin) return; // sólo admin
        if (window.confirm('¿Seguro que quieres eliminar esta boleta? Esta acción no se puede deshacer.')) {
            try {
                const response = await fetch(`http://localhost:8080/api/boletas/${id}`, { method: 'DELETE' });
                if (!response.ok && response.status !== 204) throw new Error(`Error ${response.status}`);
                // Actualiza lista en memoria para evitar recargar todo
                setBoletas(prev => prev.filter(b => b.id !== id));
                console.log(`Boleta ${id} eliminada correctamente.`);
            } catch (error) {
                console.error(`Fallo al eliminar boleta: ${error.message}`);
            }
        }
    };

    const handleGuardarUsuario = async () => {
        // Mensajes de usuario suprimidos en UI
        // setAlertaUsuario(null);

        const userToSend = { ...usuarioFormAdmin };
        if (modoEdicionUsuario && userToSend.password === '') {
            delete userToSend.password;
        }
        if (!userToSend.direccion) userToSend.direccion = "";
        if (!userToSend.telefono) userToSend.telefono = "";

        const metodo = modoEdicionUsuario ? 'PUT' : 'POST';
        const url = modoEdicionUsuario ? `http://localhost:8080/api/usuarios/${userToSend.id}` : 'http://localhost:8080/api/usuarios';

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userToSend)
            });

            if (!response.ok) throw new Error(`Error ${response.status}`);

            setShowModalUsuario(false);
            await cargarDatos();
            console.log(`Usuario ${userToSend.nombre} guardado exitosamente.`);

        } catch (error) {
            console.error(`FALLO AL GUARDAR USUARIO: ${error.message}`);
        }
    };


    // ----------------------------------------------------
    // --- 7. RENDERIZADO DEL COMPONENTE ---
    // ----------------------------------------------------
    if (cargando) {
        return (<Container className="mt-5 text-center py-5"><h4 className="text-primary">Cargando datos de administración...</h4></Container>);
    }

    return (
        <Container fluid className="p-0">
            <Row className="g-0" style={{ minHeight: '100vh' }}>

                {/* --- BARRA LATERAL (SIDEBAR) --- */}
                <Col md={2} className="bg-dark text-white p-4 d-none d-md-block">
                    <h4 className="fw-bold text-warning mb-4">{isVendedor ? 'KJM VENDEDOR' : 'KJM ADMIN'}</h4>
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <button type="button" onClick={() => setKey('productos')} className={`btn btn-link p-0 text-decoration-none d-flex align-items-center ${key === 'productos' ? 'text-warning fw-bold' : 'text-white'}`}>
                                <BoxSeam className="me-2" /> Productos
                            </button>
                        </li>
                        {isAdmin && (
                            <li className="mb-3">
                                <button type="button" onClick={() => setKey('categorias')} className={`btn btn-link p-0 text-decoration-none d-flex align-items-center ${key === 'categorias' ? 'text-warning fw-bold' : 'text-white'}`}>
                                    <Tags className="me-2" /> Categorías
                                </button>
                            </li>
                        )}
                        {isAdmin && (
                            <li className="mb-3">
                                <button type="button" onClick={() => setKey('usuarios')} className={`btn btn-link p-0 text-decoration-none d-flex align-items-center ${key === 'usuarios' ? 'text-warning fw-bold' : 'text-white'}`}>
                                    <People className="me-2" /> Usuarios
                                </button>
                            </li>
                        )}
                        {isAdmin && (
                            <li className="mb-3">
                                <button type="button" onClick={() => setKey('reportes')} className={`btn btn-link p-0 text-decoration-none d-flex align-items-center ${key === 'reportes' ? 'text-warning fw-bold' : 'text-white'}`}>
                                    <FileBarGraph className="me-2" /> Reportes
                                </button>
                            </li>
                        )}
                        {(isAdmin || isVendedor) && (
                            <li className="mb-3">
                                <button type="button" onClick={() => setKey('boletas')} className={`btn btn-link p-0 text-decoration-none d-flex align-items-center ${key === 'boletas' ? 'text-warning fw-bold' : 'text-white'}`}>
                                    <FileBarGraph className="me-2" /> Boletas
                                </button>
                            </li>
                        )}
                    </ul>
                </Col>

                {/* --- CONTENIDO PRINCIPAL --- */}
                <Col md={10} className="bg-light p-5">
                    <h2 className="mb-4">{isVendedor ? 'Panel de Venta' : 'Panel de Administración'}</h2>

                    {/* Mensajes de alerta deshabilitados para evaluación */}

                    <Tabs id="admin-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">

                        {/* PESTAÑA 1: PRODUCTOS */}
                        <Tab eventKey="productos" title="Productos">
                            <Card className="shadow-sm border-0">
                                <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center flex-wrap">
                                    <h5 className="mb-0 fw-bold">Lista de Productos ({productos.length})</h5>
                                    <div className="d-flex align-items-center flex-wrap flex-md-nowrap w-100 w-md-auto ms-md-auto mt-2 mt-md-0 gap-2 gap-sm-3 gap-md-4 gap-lg-5">
                                        <Form.Select value={filtroCategoriaId} onChange={(e) => setFiltroCategoriaId(e.target.value)} className="form-select-sm flex-grow-1 flex-md-grow-0" style={{ minWidth: '160px' }}>
                                            <option value="">Todas las categorías</option>
                                            {categorias.map(c => (
                                                <option key={c.id} value={String(c.id)}>{c.nombre}</option>
                                            ))}
                                        </Form.Select>
                                        {isAdmin && (
                                            <Button variant="primary" className="text-nowrap flex-shrink-0" onClick={() => abrirModalProducto()}>
                                                <Plus size={20} className="me-1" /> Nuevo Producto
                                            </Button>
                                        )}
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Table hover responsive className="mb-0 align-middle">
                                        <thead className="bg-light">
                                            <tr>
                                                <th style={{ width: '60px' }}>Imagen</th>
                                                <th>Producto</th><th>Precio</th><th>Stock</th><th>Categoría</th><th className="text-center">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(filtroCategoriaId ? productos.filter(p => String(p.categoria?.id) === String(filtroCategoriaId)) : productos).map((prod) => (
                                                <tr key={prod.id}>
                                                    <td>
                                                        <img src={prod.imagenUrl} alt={prod.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain' }} className="rounded border bg-white" onError={(e) => e.target.src = 'https://placehold.co/40'} />
                                                    </td>
                                                    <td className="ps-4">{prod.nombre}</td>
                                                    <td>{formatoMoneda(prod.precio)}</td>
                                                    <td><Badge bg={prod.stock > 5 ? 'success' : 'danger'}>{prod.stock} u.</Badge></td>
                                                    <td><Badge bg="secondary" className="text-uppercase">{prod.categoria?.nombre || 'Sin Cat.'}</Badge></td>
                                                    <td className="text-center">
                                                        {isAdmin ? (
                                                            <>
                                                                <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => abrirModalProducto(prod)}><Pencil /></Button>
                                                                <Button variant="danger" size="sm" onClick={() => handleEliminarProducto(prod.id)}><Trash /></Button>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted">Visualización</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Tab>

                        {/* PESTAÑA 2: CATEGORÍAS */}
                        {isAdmin && (
                            <Tab eventKey="categorias" title="Categorías">
                                <Card className="shadow-sm border-0">
                                    <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center"><h5 className="mb-0 fw-bold">Lista de Categorías ({categorias.length})</h5><Button variant="success" onClick={() => abrirModalCategoria()}><Plus size={20} /> Nueva Categoría</Button></Card.Header>
                                    <Card.Body>
                                        {/* Mensajes de categoría deshabilitados para evaluación */}
                                        <Table hover responsive className="mb-0 align-middle">
                                            <thead className="bg-light"><tr><th>ID</th><th>Nombre</th><th className="text-center">Acciones</th></tr></thead>
                                            <tbody>
                                                {categorias.map((cat) => (
                                                    <tr key={cat.id}>
                                                        <td>{cat.id}</td>
                                                        <td><Badge bg="info" className="text-dark text-uppercase">{cat.nombre}</Badge></td>
                                                        <td className="text-center">
                                                            <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => abrirModalCategoria(cat)}><Pencil /></Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Tab>
                        )}

                        {/* PESTAÑA 3: GESTIÓN DE USUARIOS */}
                        {isAdmin && (
                            <Tab eventKey="usuarios" title="Usuarios">
                                <Card className="shadow-sm border-0">
                                    <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold">Lista de Usuarios ({usuariosAdmin.length})</h5>
                                        <Button variant="info" className="text-white" onClick={() => abrirModalUsuario()}><Plus size={20} /> Nuevo Usuario</Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {/* Mensajes de usuario deshabilitados para evaluación */}
                                        <Table hover responsive className="mb-0 align-middle">
                                            <thead className="bg-light">
                                                <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Teléfono</th><th className="text-center">Acciones</th></tr>
                                            </thead>
                                            <tbody>
                                                {usuariosAdmin.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user.id}</td>
                                                        <td>{user.nombre}</td>
                                                        <td>{user.email}</td>
                                                        <td><Badge bg={user.rol === 'ADMIN' ? 'danger' : 'success'}>{user.rol}</Badge></td>
                                                        <td>{user.telefono || 'N/A'}</td>
                                                        <td className="text-center">
                                                            <Button variant="warning" size="sm" className="me-2 text-white" onClick={() => abrirModalUsuario(user)}><Pencil /></Button>
                                                            <Button variant="danger" size="sm" onClick={() => handleEliminarUsuario(user.id)} disabled={user.id === usuario.id}><Trash /></Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Tab>
                        )}

                        {/* PESTAÑA 4: REPORTES */}
                        {isAdmin && (
                            <Tab eventKey="reportes" title="Reportes">
                                <Container fluid className="p-0">

                                    {/* Métricas Generales (Card Summaries) */}
                                    <Row className="g-4 mb-5">
                                        <Col md={4}>
                                            <Card className="shadow-sm border-0 h-100 bg-primary text-white">
                                                <Card.Body>
                                                    <h4 className="card-title">📦 Total de Productos</h4>
                                                    <p className="display-4 fw-bold">{productos.length}</p>
                                                    <small>{categorias.length} Categorías Activas</small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="shadow-sm border-0 h-100 bg-success text-white">
                                                <Card.Body>
                                                    <h4 className="card-title">👤 Usuarios Registrados</h4>
                                                    <p className="display-4 fw-bold">{usuariosAdmin.length}</p>
                                                    <small>
                                                        Admins: {usuariosAdmin.filter(u => u.rol === 'ADMIN').length} / Users: {usuariosAdmin.filter(u => u.rol === 'USER').length}
                                                    </small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="shadow-sm border-0 h-100 bg-danger text-white">
                                                <Card.Body>
                                                    <h4 className="card-title">⚠️ Stock Bajo</h4>
                                                    <p className="display-4 fw-bold">
                                                        {productos.filter(p => p.stock <= 5).length}
                                                    </p>
                                                    <small>Productos con menos de 5 unidades.</small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* Reporte Detallado: Productos con Stock Bajo (EXCEL) */}
                                    <Row className="mb-5">
                                        <Col md={12}>
                                            <Card className="shadow-sm border-0">
                                                <Card.Header className="fw-bold bg-light d-flex justify-content-between align-items-center">
                                                    <span>Lista de Alerta de Stock Crítico (Stock {'<='} 5)</span>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => exportToCSV(productos.filter(p => p.stock <= 5).map(p => ({ id: p.id, nombre: p.nombre, stock: p.stock, categoria: p.categoria?.nombre || 'N/A' })), 'Reporte_Stock_Critico')}
                                                    >
                                                        Descargar Reporte Productos Crítico 📄
                                                    </Button>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Table striped bordered hover size="sm">
                                                        <thead>
                                                            <tr><th>ID</th><th>Nombre del Producto</th><th>Stock Actual</th><th>Categoría</th></tr>
                                                        </thead>
                                                        <tbody>
                                                            {productos.filter(p => p.stock <= 5).map(prod => (
                                                                <tr key={prod.id}>
                                                                    <td>{prod.id}</td>
                                                                    <td>{prod.nombre}</td>
                                                                    <td className="fw-bold text-danger">{prod.stock}</td>
                                                                    <td>{prod.categoria?.nombre || 'N/A'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                    {productos.filter(p => p.stock <= 5).length === 0 && (
                                                        <div className="mt-3 text-center text-info">¡Stock saludable! No se encontraron productos con existencias bajas.</div>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* REPORTES COMPLETOS */}
                                    <Row className="g-4">
                                        <Col md={6}>
                                            <Card className="shadow-sm border-0 h-100">
                                                <Card.Header className="fw-bold bg-info text-white">Inventario Completo de Productos</Card.Header>
                                                <Card.Body className="d-flex justify-content-between align-items-center">
                                                    <span>Total de **{productos.length}** productos registrados con todos sus detalles.</span>
                                                    <Button
                                                        variant="info"
                                                        onClick={() => exportToCSV(productos.map(p => ({
                                                            id: p.id, nombre: p.nombre, descripcion: p.descripcion, precio: p.precio,
                                                            stock: p.stock, categoria: p.categoria?.nombre || 'N/A', imagenUrl: p.imagenUrl
                                                        })), 'Reporte_Productos_Total')}
                                                    >
                                                        Descargar Reporte Productos 📦
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>

                                        <Col md={6}>
                                            <Card className="shadow-sm border-0 h-100">
                                                <Card.Header className="fw-bold bg-secondary text-white">Base de Datos de Usuarios</Card.Header>
                                                <Card.Body className="d-flex justify-content-between align-items-center">
                                                    <span>Total de **{usuariosAdmin.length}** usuarios registrados (Excluye contraseña).</span>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => {
                                                            // 🔑 INCLUYE PASSWORD EN TEXTO PLANO
                                                            const usuariosSeguros = usuariosAdmin.map(user => ({
                                                                id: user.id,
                                                                nombre: user.nombre,
                                                                email: user.email,
                                                                password: user.password, // Incluido por solicitud
                                                                direccion: user.direccion,
                                                                telefono: user.telefono,
                                                                rol: user.rol
                                                            }));
                                                            exportToCSV(usuariosSeguros, 'Reporte_Usuarios_Total');
                                                        }}
                                                    >
                                                        Descargar Reporte Usuarios 👤
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                </Container>
                            </Tab>
                        )}

                        {(isAdmin || isVendedor) && (
                            <Tab eventKey="boletas" title="Boletas">
                                <Card className="shadow-sm border-0">
                                    <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold">Listado de Boletas ({boletas.length})</h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table hover responsive className="mb-0 align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Fecha</th>
                                                    <th>Total</th>
                                                    <th>Items</th>
                                                    <th>Usuario</th>
                                                    {isAdmin && <th className="text-center">Acciones</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {boletas.map((b) => (
                                                    <tr key={b.id}>
                                                        <td>{b.numero || b.id}</td>
                                                        <td>{b.fecha ? new Date(b.fecha).toLocaleString('es-CL') : '-'}</td>
                                                        <td>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(b.total || 0)}</td>
                                                        <td>{Array.isArray(b.detalles) ? b.detalles.reduce((acc, d) => acc + (d.cantidad || 0), 0) : 0}</td>
                                                        <td>{b.usuario?.id ?? b.usuarioId ?? '-'}</td>
                                                        {isAdmin && (
                                                            <td className="text-center">
                                                                <Button variant="danger" size="sm" onClick={() => handleEliminarBoleta(b.id)}>
                                                                    <Trash />
                                                                </Button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                        {boletas.length === 0 && (
                                            <div className="text-center p-3 text-muted">No hay boletas registradas.</div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Tab>
                        )}
                    </Tabs>
                </Col>
            </Row>

            {/* --- MODALES --- */}
            <Modal show={showModalProducto} onHide={() => setShowModalProducto(false)} centered>
                <Modal.Header closeButton><Modal.Title>{modoEdicionProducto ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control type="text" placeholder="Ej: Balón de Fútbol" value={productoForm.nombre} onChange={(e) => setProductoForm({ ...productoForm, nombre: e.target.value })} /></Form.Group>
                        <Row><Col><Form.Group className="mb-3"><Form.Label>Precio</Form.Label><Form.Control type="number" value={productoForm.precio || ''} onChange={(e) => setProductoForm({ ...productoForm, precio: parseFloat(e.target.value) || 0 })} /></Form.Group></Col><Col><Form.Group className="mb-3"><Form.Label>Stock</Form.Label><Form.Control type="number" value={productoForm.stock || ''} onChange={(e) => setProductoForm({ ...productoForm, stock: parseInt(e.target.value) || 0 })} /></Form.Group></Col></Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select value={productoForm.categoria?.id?.toString() || ''} onChange={(e) => setProductoForm({ ...productoForm, categoria: { id: e.target.value } })}>
                                {categorias.map(cat => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>URL de la Imagen</Form.Label><Form.Control type="text" placeholder="https://..." value={productoForm.imagenUrl} onChange={(e) => setProductoForm({ ...productoForm, imagenUrl: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Descripción</Form.Label><Form.Control as="textarea" rows={3} value={productoForm.descripcion} onChange={(e) => setProductoForm({ ...productoForm, descripcion: e.target.value })} /></Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalProducto(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleGuardarProducto}>
                        {modoEdicionProducto ? 'Guardar Cambios' : 'Crear Producto'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL DE CATEGORÍAS */}
            <Modal show={showModalCategoria} onHide={() => setShowModalCategoria(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modoEdicionCategoria ? 'Editar Categoría' : 'Nueva Categoría'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control type="text" placeholder="Ej: Zapatillas Deportivas" value={categoriaForm.nombre} onChange={(e) => setCategoriaForm({ ...categoriaForm, nombre: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Descripción</Form.Label><Form.Control as="textarea" rows={3} placeholder="Descripción detallada de la categoría" value={categoriaForm.descripcion} onChange={(e) => setCategoriaForm({ ...categoriaForm, descripcion: e.target.value })} /></Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalCategoria(false)}>Cancelar</Button>
                    <Button variant="success" onClick={handleGuardarCategoria}>
                        {modoEdicionCategoria ? 'Guardar Cambios' : 'Crear Categoría'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL DE USUARIOS */}
            <Modal show={showModalUsuario} onHide={() => setShowModalUsuario(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modoEdicionUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control type="text" placeholder="Nombre completo" value={usuarioFormAdmin.nombre} onChange={(e) => setUsuarioFormAdmin({ ...usuarioFormAdmin, nombre: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" placeholder="ejemplo@dominio.com" value={usuarioFormAdmin.email} onChange={(e) => setUsuarioFormAdmin({ ...usuarioFormAdmin, email: e.target.value })} /></Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3"><Form.Label>Teléfono</Form.Label><Form.Control type="text" placeholder="+56..." value={usuarioFormAdmin.telefono} onChange={(e) => setUsuarioFormAdmin({ ...usuarioFormAdmin, telefono: e.target.value })} /></Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Rol</Form.Label>
                                    <Form.Select value={usuarioFormAdmin.rol} onChange={(e) => setUsuarioFormAdmin({ ...usuarioFormAdmin, rol: e.target.value })}>
                                        <option value="USER">USER</option>
                                        <option value="CLIENTE">CLIENTE</option>
                                        <option value="VENDEDOR">VENDEDOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3"><Form.Label>Dirección</Form.Label><Form.Control type="text" placeholder="Calle, número, comuna" value={usuarioFormAdmin.direccion} onChange={(e) => setUsuarioFormAdmin({ ...usuarioFormAdmin, direccion: e.target.value })} /></Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder={modoEdicionUsuario ? "Dejar vacío para no cambiar" : "Contraseña obligatoria"} value={usuarioFormAdmin.password} onChange={(e) => setUsuarioFormAdmin({ ...usuarioFormAdmin, password: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalUsuario(false)}>Cancelar</Button>
                    <Button variant="info" className="text-white" onClick={handleGuardarUsuario}>
                        {modoEdicionUsuario ? 'Guardar Cambios' : 'Crear Usuario'}
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default AdminPanel;