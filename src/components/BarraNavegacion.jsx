import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import { CartFill, PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
// Aseguramos que las rutas de contexto sean correctas
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';

function BarraNavegacion() {
  const [categorias, setCategorias] = useState([]);
  const { cantidadTotal } = useCarrito();
  const { usuario, logout } = useAuth();
  const isVendedor = usuario?.rol === 'VENDEDOR';
  const isAdmin = usuario?.rol === 'ADMIN';

  useEffect(() => {
    // Simulación de carga de categorías de la API
    fetch('http://localhost:8080/api/categorias')
      .then(response => response.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Error cargando categorías:', error));
  }, []);

  return (
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark" bg="dark">
      <Container>
        <Navbar.Brand as={Link} to={isVendedor ? "/admin" : "/"} style={{ fontWeight: 'bold', color: '#ffc107' }}>
          KJM SPORTS
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isVendedor && <Nav.Link as={Link} to="/">Inicio</Nav.Link>}
            <Nav.Link as={Link} to="/productos">Productos</Nav.Link>

            {!isVendedor && (
              <NavDropdown title="Categorías" id="basic-nav-dropdown">
                {categorias.map((cat) => (
                  <NavDropdown.Item key={cat.id} as={Link} to={`/categoria/${cat.id}`}>
                    {cat.nombre}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/productos">Ver Todas</NavDropdown.Item>
              </NavDropdown>
            )}

            {!isVendedor && <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>}
            {!isVendedor && <Nav.Link as={Link} to="/contacto">Contáctanos</Nav.Link>}
          </Nav>

          <Nav>
            {!isVendedor && (
              <Nav.Link as={Link} to="/carrito" className="position-relative me-3">
                <CartFill size={20} style={{ marginRight: '5px' }} />
                Carrito
                {cantidadTotal > 0 && (
                  <Badge pill bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.7rem' }}>
                    {cantidadTotal}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {usuario ? (
              <NavDropdown
                title={
                  <span className="fw-bold text-warning">
                    <PersonCircle size={20} className="me-2" />
                    {usuario.nombre}
                  </span>
                }
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>

                {(isAdmin || isVendedor) && (
                  <NavDropdown.Item as={Link} to="/admin" className="text-primary fw-bold">
                    ⚙️ {isVendedor ? 'Panel Venta' : 'Panel Admin'}
                  </NavDropdown.Item>
                )}

                <NavDropdown.Item as={Link} to="/mis-compras">Mis Compras</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout} className="text-danger fw-bold">
                  <BoxArrowRight className="me-2" /> Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/registro">Registro</Nav.Link>
                <Nav.Link as={Link} to="/login">
                  <PersonCircle size={20} style={{ marginRight: '5px' }} />
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;