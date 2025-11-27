import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext'; // 1. Importamos el hook del carrito

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const { idCategoria } = useParams();
  const { agregarAlCarrito } = useCarrito(); // 2. Obtenemos la función para agregar

  // Estados para el Modal
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then(response => response.json())
      .then(data => {
        if (idCategoria) {
            const filtrados = data.filter(prod => prod.categoria && prod.categoria.id == idCategoria);
            setProductos(filtrados);
        } else {
            setProductos(data);
        }
      })
      .catch(error => console.error('Error al cargar productos:', error));
  }, [idCategoria]);

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
  };

  const handleVerDetalles = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  const handleCerrar = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
  };

  const titulo = idCategoria ? `PRODUCTOS DE LA CATEGORÍA` : `CATÁLOGO COMPLETO`;

  return (
    <Container fluid className="mt-5 p-4 mb-5"> 
      <h2 className="text-center mb-4" style={{color: '#ffc107', fontWeight: 'bold'}}>{titulo}</h2>
      
      {productos.length === 0 && (
          <div className="text-center py-5"><h4 className="text-muted">No se encontraron productos.</h4></div>
      )}

      <Row className="justify-content-center"> 
        {productos.map((producto) => (
          <Col key={producto.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <div style={{ position: 'relative' }}>
                <Card.Img 
                    variant="top" src={producto.imagenUrl} alt={producto.nombre}
                    style={{ height: '250px', objectFit: 'contain', padding: '10px' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/png?text=Sin+Imagen'; }}
                />
                 <span className="badge bg-dark position-absolute top-0 end-0 m-3">{producto.categoria ? producto.categoria.nombre : 'General'}</span>
              </div>
              <Card.Body className="d-flex flex-column text-center">
                <Card.Title className="fw-bold text-truncate">{producto.nombre}</Card.Title>
                <Card.Text className="text-muted small text-truncate">{producto.descripcion}</Card.Text>
                <Card.Text className="fw-bold text-success" style={{ fontSize: '1.4rem' }}>{formatoMoneda(producto.precio)}</Card.Text>
                
                <div className="mt-auto d-flex gap-2 justify-content-center">
                    <Button variant="outline-secondary" className="w-100 rounded-pill btn-sm" onClick={() => handleVerDetalles(producto)}>Ver Detalles</Button>
                    
                    {/* 3. BOTÓN AÑADIR CONECTADO (En la tarjeta) */}
                    <Button 
                        variant="outline-dark" 
                        className="w-100 rounded-pill btn-sm" 
                        onClick={() => agregarAlCarrito(producto)}
                    >
                        Añadir
                    </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* MODAL DE DETALLES */}
      <Modal show={showModal} onHide={handleCerrar} size="lg" centered>
        {productoSeleccionado && (
            <>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold text-uppercase">{productoSeleccionado.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6} className="d-flex align-items-center justify-content-center bg-light rounded-3 p-3">
                            <img src={productoSeleccionado.imagenUrl} className="img-fluid" style={{ maxHeight: '350px', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://placehold.co/600x400/png?text=Sin+Imagen'; }} />
                        </Col>
                        <Col md={6} className="d-flex flex-column justify-content-center mt-3 mt-md-0">
                            <h5 className="text-muted text-uppercase small mb-1">{productoSeleccionado.categoria ? productoSeleccionado.categoria.nombre : 'General'}</h5>
                            <h2 className="text-success fw-bold mb-3">{formatoMoneda(productoSeleccionado.precio)}</h2>
                            <p className="lead fs-6">{productoSeleccionado.descripcion}</p>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className={productoSeleccionado.stock > 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                                    {productoSeleccionado.stock > 0 ? `En Stock: ${productoSeleccionado.stock}` : 'Agotado'}
                                </span>
                                <small className="text-muted">SKU: {productoSeleccionado.id}</small>
                            </div>
                            
                            {/* 4. BOTÓN AÑADIR CONECTADO (En el Modal) */}
                            {/* Al hacer clic, agrega al carrito y cierra el modal */}
                            <Button 
                                variant="dark" 
                                size="lg" 
                                className="w-100 rounded-pill shadow" 
                                onClick={() => { 
                                    agregarAlCarrito(productoSeleccionado); 
                                    handleCerrar(); 
                                }}
                            >
                                Añadir al Carrito
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </>
        )}
      </Modal>
    </Container>
  );
}

export default ListaProductos;