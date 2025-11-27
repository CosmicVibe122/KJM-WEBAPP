import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

function Inicio() {
  const [destacados, setDestacados] = useState([]);
  const { agregarAlCarrito } = useCarrito();

  // Estados para el Modal
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then(response => response.json())
      .then(data => {
        const barajados = data.sort(() => 0.5 - Math.random());
        setDestacados(barajados.slice(0, 6));
      })
      .catch(error => console.error('Error al cargar destacados:', error));
  }, []);

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

  return (
    <Container className="mt-5">

      <div className="text-center mb-5">
        <h1 style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>Bienvenido a KJM Sports</h1>
        <div style={{ height: '5px', width: '100px', backgroundColor: '#ffc107', margin: '15px auto' }}></div>
      </div>


      <Row className="mb-5 g-4">
        <Col md={6}>
          <div className="p-5 text-white rounded-4 d-flex align-items-end shadow" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', height: '400px' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
              <h3>Deportes de Invierno</h3>
              <p>Equípate para la aventura.</p>
              <Link to="/productos"><Button variant="light" size="sm" className="fw-bold">Ver Colección</Button></Link>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-5 text-white rounded-4 d-flex align-items-end shadow" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', height: '400px' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(5px)' }}>
              <h3>Running Pro</h3>
              <p>Supera tus límites.</p>
              <Link to="/productos"><Button variant="warning" size="sm" className="fw-bold text-dark">Comprar Ahora</Button></Link>
            </div>
          </div>
        </Col>
      </Row>


      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🔥 Lo Más Vendido </h2>
        <Link to="/productos"><Button variant="outline-dark">Ver Catálogo Completo</Button></Link>
      </div>


      <Row>
        {destacados.map((producto) => (
          <Col key={producto.id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <div style={{ position: 'relative' }}>
                <Card.Img variant="top" src={producto.imagenUrl} style={{ height: '250px', objectFit: 'contain', padding: '15px' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/png?text=Sin+Imagen'; }} />
                <span className="badge bg-dark position-absolute top-0 end-0 m-3">{producto.categoria ? producto.categoria.nombre : 'General'}</span>
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-bold text-truncate">{producto.nombre}</Card.Title>
                <Card.Text className="text-muted small text-truncate">{producto.descripcion}</Card.Text>
                <Card.Text className="fw-bold text-success fs-4">{formatoMoneda(producto.precio)}</Card.Text>

                <div className="mt-auto d-flex gap-2 justify-content-center">
                  <Button variant="outline-secondary" className="w-100 rounded-pill btn-sm" onClick={() => handleVerDetalles(producto)}>Ver Detalles</Button>


                  <Button variant="outline-dark" className="w-100 rounded-pill btn-sm" onClick={() => agregarAlCarrito(producto)}>Añadir</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4 mb-5">
        <Link to="/productos"><Button variant="dark" size="lg" className="px-5 rounded-pill shadow">Explorar Todos los Productos</Button></Link>
      </div>


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

                  <Button variant="dark" size="lg" className="w-100 rounded-pill shadow" onClick={() => { agregarAlCarrito(productoSeleccionado); handleCerrar(); }}>
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

export default Inicio;