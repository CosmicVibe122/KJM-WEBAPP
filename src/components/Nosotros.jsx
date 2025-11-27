import React from 'react';
import './Nosotros.css'; // Importa los estilos CSS
import imagenEquipo from '../assets/imagen_nosotros.jpg'; // Ajusta el nombre del archivo
import imagenMision from '../assets/imagen_nosotros2.jpg'; // Ajusta el nombre del archivo si tienes otra
const Nosotros = () => {
  return (
    <section className="seccion-nosotros">
      <div className="encabezado-nosotros">
        <h2>Conoce a <span className="resaltar">KJMSports</span></h2>
        <p className="subtitulo">Impulsando tu pasión, equipando tus sueños.</p>
      </div>

      <div className="contenido-principal-nosotros">

        <div className="bloque-info intro-kjmsports">
          <div className="texto-intro">
            <h3>Nuestra Historia</h3>
            <p>
              En **KJMSports**, no solo vendemos equipamiento; fomentamos el espíritu deportivo.
              Desde nuestra fundación en **2015**, nos hemos dedicado a ofrecer productos
              de la más alta calidad y el asesoramiento experto que cada deportista merece.
              Hemos crecido de una pequeña tienda local a un referente, gracias a la
              confianza y el apoyo de nuestra increíble comunidad atlética.
            </p>
          </div>
          <div className="imagen-intro">

            <img
              src={imagenEquipo}
              alt="Equipo de KJMSports celebrando"
            />
          </div>
        </div>


        <div className="bloque-info mision-vision">
          <div className="imagen-mision">

            <img
              src={imagenMision}
              alt="Atleta en plena acción, simbolizando la misión"
            />
          </div>
          <div className="texto-mision-vision">
            <h3>Nuestra Misión</h3>
            <p>
              Ser la plataforma líder para atletas de todos los niveles, proporcionando
              productos innovadores, seguros y de alto rendimiento que inspiren a superar
              límites y alcanzar la grandeza.
            </p>
            <h3>Nuestra Visión</h3>
            <p>
              Crear una comunidad global de deportistas empoderados, donde cada individuo
              tenga acceso a las herramientas y el soporte necesarios para vivir una vida
              activa y plena.
            </p>
          </div>
        </div>


        <div className="nuestros-valores">
          <h3>Nuestros Valores</h3>
          <div className="contenedor-valores">
            <div className="valor">
              <h4><span className="icono">💪</span> Integridad</h4>
              <p>Actuamos con honestidad, transparencia y ética en cada interacción, construyendo confianza.</p>
            </div>
            <div className="valor">
              <h4><span className="icono">✨</span> Excelencia</h4>
              <p>Buscamos la perfección en nuestros productos y servicios, siempre superando expectativas.</p>
            </div>
            <div className="valor">
              <h4><span className="icono">🤝</span> Compromiso</h4>
              <p>Estamos dedicados a la satisfacción de nuestros clientes y al desarrollo de la comunidad deportiva.</p>
            </div>
            <div className="valor">
              <h4><span className="icono">🌱</span> Innovación</h4>
              <p>Constantemente exploramos nuevas tecnologías y tendencias para ofrecer lo mejor del mercado.</p>
            </div>
            <div className="valor">
              <h4><span className="icono">❤️</span> Pasión</h4>
              <p>Amamos lo que hacemos y eso se refleja en el entusiasmo y dedicación que ponemos en cada detalle.</p>
            </div>
          </div>
        </div>


        <div className="llamada-accion-final">
          <p>Únete a la familia KJMSports y vive el deporte al máximo.</p>
          <button className="btn-conoce-mas">Explora nuestros productos</button>
        </div>

      </div>
    </section>
  );
};

export default Nosotros;