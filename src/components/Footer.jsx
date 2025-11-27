import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row className="gy-4">
          
          {/* COLUMNA 1: MARCA Y DESCRIPCIÓN */}
          <Col md={4} className="text-center text-md-start">
            <h5 className="text-warning fw-bold">KJM SPORTS</h5>
            <p className="small text-secondary">
              Tu tienda deportiva de confianza. Encuentra equipamiento profesional para fútbol, ciclismo, natación y boxeo. Calidad garantizada.
            </p>
          </Col>

          {/* COLUMNA 2: ENLACES RÁPIDOS */}
          <Col md={4} className="text-center">
            <h6 className="text-uppercase fw-bold mb-3">Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-light small">Inicio</Link></li>
              <li><Link to="/productos" className="text-decoration-none text-light small">Catálogo</Link></li>
              <li><a href="#" className="text-decoration-none text-light small">Nosotros</a></li>
              <li><a href="#" className="text-decoration-none text-light small">Contáctanos</a></li>
            </ul>
          </Col>

          {/* COLUMNA 3: CONTACTO Y REDES */}
          <Col md={4} className="text-center text-md-end">
            <h6 className="text-uppercase fw-bold mb-3">Síguenos</h6>
            <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-3">
              {/* Usamos clases 'bi' directas para evitar errores de importación */}
              <a href="#" className="text-light"><i className="bi bi-facebook" style={{ fontSize: '20px' }}></i></a>
              <a href="#" className="text-light"><i className="bi bi-instagram" style={{ fontSize: '20px' }}></i></a>
              <a href="#" className="text-light"><i className="bi bi-twitter" style={{ fontSize: '20px' }}></i></a>
            </div>
            <p className="small text-secondary mb-0">
              <i className="bi bi-whatsapp me-2 text-success"></i> +56 9 1234 5678
            </p>
            <p className="small text-secondary">contacto@kjmsports.cl</p>
          </Col>

        </Row>
        
        <hr className="border-secondary my-3" />
        
        <div className="text-center small text-secondary">
          &copy; {new Date().getFullYear()} KJM Sports. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;