import { Box, Typography } from "@mui/material";
//import DestinosPopulares from "./DestinosPopulares";
import OfertasEspeciales from "./OfertasEspeciales";
import TestimoniosClientes from "./TestimoniosClientes";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import Service from "./Service";
import ItemListContainer from "../../itemlist/ItemListContainer";


const Destacados = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        
      </Typography>
    <Service/>
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          
        </Typography>
        <OfertasEspeciales />
      </Box>
      <Box sx={{ mb: 8}}>
        <Typography variant="h5" gutterBottom textAlign="center">
          
        </Typography>
        
        <ItemListContainer />
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom textAlign="center">
          Testimonios de Clientes
        </Typography>
        <TestimoniosClientes />
      </Box>
      <Box>
        <ContactForm/>
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom textAlign="center">
          
        </Typography>
        <Footer/>
        
      </Box>
    </Box>
  );
};

export default Destacados;

