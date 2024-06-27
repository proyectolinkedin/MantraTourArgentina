
import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#3f51b5", color: "white", py: 6 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Sección de enlaces rápidos */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Enlaces Rápidos
          </Typography>
          <Link href="/about" color="inherit" underline="hover">
            Sobre Nosotros
          </Link>
          <br />
          <Link href="/services" color="inherit" underline="hover">
            Servicios
          </Link>
          <br />
          <Link href="/contact" color="inherit" underline="hover">
            Contacto
          </Link>
        </Grid>
        {/* Sección de contacto */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Contacto
          </Typography>
          <Typography variant="body2">Email: info@agenciaviajes.com</Typography>
          <Typography variant="body2">Teléfono: +123 456 7890</Typography>
          <Typography variant="body2">Dirección: Calle Ejemplo 123, Ciudad</Typography>
        </Grid>
        {/* Sección de redes sociales */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Síguenos
          </Typography>
          <Box>
            <IconButton href="https://www.facebook.com" target="_blank" color="inherit">
              <FacebookIcon />
            </IconButton>
            <IconButton href="https://www.twitter.com" target="_blank" color="inherit">
              <TwitterIcon />
            </IconButton>
            <IconButton href="https://www.instagram.com" target="_blank" color="inherit">
              <InstagramIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Box textAlign="center" pt={5}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Agencia de Viajes. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
