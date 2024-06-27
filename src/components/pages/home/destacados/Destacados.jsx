import { Box, Typography } from "@mui/material";
import DestinosPopulares from "./DestinosPopulares";
import OfertasEspeciales from "./OfertasEspeciales";
import TestimoniosClientes from "./TestimoniosClientes";
import Footer from "./Footer";

const Destacados = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          
        </Typography>
        <DestinosPopulares />
      </Box>
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Ofertas Especiales
        </Typography>
        <OfertasEspeciales />
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom textAlign="center">
          Testimonios de Clientes
        </Typography>
        <TestimoniosClientes />
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

