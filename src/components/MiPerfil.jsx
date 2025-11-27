import React from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function MiPerfil() {
    const { usuario } = useAuth();

    if (!usuario) {
        return (
            <Container className="my-5 text-center">
                <Card className="shadow-sm border-0 p-4">
                    <h4 className="mb-2">Debes iniciar sesión</h4>
                    <p className="text-muted">Accede para ver tu información de perfil.</p>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-light">
                    <h4 className="mb-0">Mi Perfil</h4>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-2"><strong>Nombre:</strong> {usuario.nombre}</div>
                            <div className="mb-2"><strong>Email:</strong> {usuario.email}</div>
                            <div className="mb-2"><strong>Teléfono:</strong> {usuario.telefono || 'N/A'}</div>
                            {/* Rol oculto a solicitud */}
                        </Col>
                        <Col md={6}>
                            <div className="mb-2"><strong>Dirección:</strong> {usuario.direccion || 'N/A'}</div>
                            {/* Campos adicionales si existen en el modelo */}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default MiPerfil;
