import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';

function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    direccion: '',
    telefono: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        alert('Hubo un error al registrarse.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card style={{ width: '500px' }} className="shadow-lg border-0">
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold">Crear Cuenta</h2>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control name="nombre" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" name="password" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control name="direccion" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control name="telefono" onChange={handleChange} />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 btn-lg mb-3">
              Registrarse
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted">¿Ya tienes cuenta? </span>
            <Link to="/login" className="text-decoration-none fw-bold">Inicia Sesión</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Registro;