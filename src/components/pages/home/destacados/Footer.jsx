import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import "./Footer.css"; // Importa el archivo CSS de estilos

const Footer = () => {
  return (
    <Box className="footer-container">
      <Grid container spacing={4} justifyContent="center">
        {/* Sección de enlaces rápidos */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" className="footer-title">
            Enlaces Rápidos
          </Typography>
          <Box className="footer-section">
            <Link href="/about" className="footer-link">
              Sobre Nosotros
            </Link>
            <Link href="/services" className="footer-link">
              Servicios
            </Link>
            <Link href="/contact" className="footer-link">
              Contacto
            </Link>
          </Box>
        </Grid>
        {/* Sección de contacto */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" className="footer-title">
            Contacto
          </Typography>
          <Typography variant="body2" className="footer-section footer-contact">
            Email: mantratourargentina@gmail.com
          </Typography>
          <Typography variant="body2" className="footer-section footer-contact">
            Teléfono: +54 9 11 3819 0372
          </Typography>
          <Typography variant="body2" className="footer-section footer-contact">
            Dirección: Shopping Los Nogales ,Tristán Suárez
          </Typography>
        </Grid>
        {/* Sección de redes sociales */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" className="footer-title">
            Síguenos
          </Typography>
          <Box className="footer-section footer-social">
            <IconButton href="https://www.facebook.com/mantratourargentina" target="_blank" className="footer-social-icon">
              <FacebookIcon />
            </IconButton>
            <IconButton href="https://www.twitter.com" target="_blank" className="footer-social-icon">
              <TwitterIcon />
            </IconButton>
            <IconButton href="https://www.instagram.com/mantra.tour" target="_blank" className="footer-social-icon">
              <InstagramIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Box textAlign="center" pt={5} mt={2}>
        <Typography variant="body2" className="footer-copyright">
          © {new Date().getFullYear()} Agencia de Viajes. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
