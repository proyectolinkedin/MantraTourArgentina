import Carrousel from "../../layout/navbar/Carrousel";
import WhatsAppButton from "../../layout/navbar/WhatsAppButton";
import Destacados from "./destacados/Destacados";

//import { Link } from "react-router-dom";

const Home = () => {


  return (
    
       <div>
  <Carrousel/>  
  <Destacados/>
  <WhatsAppButton phoneNumber="5491138190372" defaultMessage="¡Hola! Me gustaría saber más sobre sus servicios." />
  
     
  </div>
  );
};

export default Home;
