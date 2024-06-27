
import { Link } from 'react-router-dom';
import './Carrousel.css'; // Importa tus estilos personalizados

const Carrousel = () => {
  return (
    <div className="video-container">
      <video loop muted autoPlay playsInline>
        <source src="https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/Portada%20Facebook%20hora%20del%20planeta%20azul%20(2).mp4?alt=media&token=e43c306e-afc5-4423-9230-8c6996844ee5" type="video/mp4" />
        
      </video>
      <Link to="/shop" className="carousel-button">Ver Promos</Link>
    </div>
  );
};

export default Carrousel;


