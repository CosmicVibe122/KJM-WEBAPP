import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        login(data); // Guardamos el usuario en el contexto global


        if (data.rol === 'ADMIN' || data.rol === 'VENDEDOR') {
          navigate('/admin');
        } else if (data.rol === 'CLIENTE') {
          navigate('/productos');
        } else {
          navigate('/');
        }

      } else {

        setError('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError('Error de conexión con el servidor. Verifica que el Backend esté activo.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="shadow-lg border-0">
        <Card.Body className="p-5">
          <h2 className="text-center mb-4 fw-bold">Iniciar Sesión</h2>

          {error && <div className="alert alert-danger text-center p-2 mb-3">{error}</div>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3 btn-lg">
              Entrar
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span className="text-muted">¿No tienes cuenta? </span>
            <Link to="/registro" className="text-decoration-none fw-bold">Regístrate</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;