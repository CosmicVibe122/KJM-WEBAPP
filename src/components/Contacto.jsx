import React, { useState } from 'react';
// 🔑 Importamos Alert para mostrar el mensaje de éxito en la página
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import './Contacto.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState({});
  const [caracteresMensaje, setCaracteresMensaje] = useState(0);
  // 🔑 NUEVO ESTADO: Para controlar la visibilidad del mensaje de éxito
  const [envioExitoso, setEnvioExitoso] = useState(false);

  // Expresiones regulares para validación
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|duocuc\.cl|profesor\.cl)$/;
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{10,}$/;
  const mensajeMinLength = 100;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'mensaje') {
      setCaracteresMensaje(value.length);
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    // Si el usuario edita, ocultamos el mensaje de éxito anterior
    setEnvioExitoso(false);
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    // Validación de Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
      isValid = false;
    } else if (!nombreRegex.test(formData.nombre.trim())) {
      newErrors.nombre = 'Debe tener al menos 10 caracteres y dos palabras (Ej: Jorge Alvarado).';
      isValid = false;
    } else if (formData.nombre.trim().split(' ').filter(Boolean).length < 2) {
      newErrors.nombre = 'Debe contener al menos dos palabras.';
      isValid = false;
    }

    // Validación de Correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio.';
      isValid = false;
    } else if (!emailRegex.test(formData.correo.trim())) {
      newErrors.correo = 'El correo debe terminar en @gmail.com, @duocuc.cl, o @profesor.cl.';
      isValid = false;
    }

    // Validación de Mensaje
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es obligatorio.';
      isValid = false;
    } else if (formData.mensaje.trim().length < mensajeMinLength) {
      newErrors.mensaje = `El mensaje debe tener al menos ${mensajeMinLength} caracteres.`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Formulario enviado:', formData);

      // 🔑 1. Establecer el estado de éxito (REEMPLAZA EL ALERT)
      setEnvioExitoso(true);

      // 2. Resetear el formulario
      setFormData({ nombre: '', correo: '', mensaje: '' });
      setCaracteresMensaje(0);
      setErrors({});

      // 3. Opcional: Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setEnvioExitoso(false);
      }, 5000);

    } else {
      console.log('Errores en el formulario:', errors);
      // No se necesita alert aquí, los errores se muestran al lado de los campos
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4 titulo-contacto">Contáctanos</h2>

              {/* 🔑 MOSTRAR EL MENSAJE DE ÉXITO CONDICIONALMENTE */}
              {envioExitoso && (
                <Alert variant="success" onClose={() => setEnvioExitoso(false)} dismissible className="alerta-exito">
                  ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Campo Nombre */}
                <Form.Group className="mb-3" controlId="formNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Ej: Jorge Alvarado"
                    value={formData.nombre}
                    onChange={handleChange}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Text className="text-muted">
                    Ej: Jorge Alvarado — debe tener mínimo 10 caracteres y al menos dos palabras.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Campo Correo */}
                <Form.Group className="mb-3" controlId="formCorreo">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    placeholder="Ej: usuario@gmail.com"
                    value={formData.correo}
                    onChange={handleChange}
                    isInvalid={!!errors.correo}
                  />
                  <Form.Text className="text-muted">
                    Ej: Los correos deben terminar en @gmail.com, @duocuc.cl, @profesor.cl
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.correo}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Campo Mensaje */}
                <Form.Group className="mb-3" controlId="formMensaje">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="mensaje"
                    rows={6}
                    placeholder="Escribe tu mensaje aquí (mínimo 100 caracteres)..."
                    value={formData.mensaje}
                    onChange={handleChange}
                    isInvalid={!!errors.mensaje}
                  />
                  <Form.Text className="text-muted d-flex justify-content-between">
                    <span>Ejemplo: Describe tu consulta con detalles. Mínimo {mensajeMinLength} caracteres.</span>
                    <span>Caracteres: {caracteresMensaje}</span>
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.mensaje}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-start align-items-center mt-4">
                  <Button variant="primary" type="submit" className="btn-enviar-mensaje">
                    Enviar Mensaje
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacto;