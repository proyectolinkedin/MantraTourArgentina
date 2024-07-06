
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";

const Service = () => {
  const testimonios = [
    {
      nombre: "Excursiones",
      imagen: "https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/Excursion.png?alt=media&token=d4c5b9cf-de52-4ba3-bcef-08a8b8143ca5",
      testimonio: "“Descubre aventuras inolvidables en los paisajes más asombrosos de Argentina. ¡Reserva hoy!”"
    },
    {
      nombre: "Hoteles",
      imagen: "https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/Hotel.png?alt=media&token=2bf88bc0-ed2e-4f97-8d5d-552a53bbed13",
      testimonio: "“Encuentra tu refugio perfecto en los mejores hoteles de Argentina. Comodidad, vistas espectaculares y atención excepcional te esperan.”"
    },
    {
      nombre: "Vuelos",
      imagen: "https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/Vuelos.png?alt=media&token=cfe09163-2416-4d0a-9525-470d7b78a9e0",
      testimonio: "“Explora los cielos de Argentina con nuestras ofertas de vuelos. ¡Reserva ahora y despega hacia nuevas aventuras!”"
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: "center", color: "inherit" }}>
        Nuestros Servicios
      </Typography>
      <Grid container spacing={2}>
        {testimonios.map((testimonio, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: "#000000",
                  color: "#ffffff",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 120,
                  }}
                >
                  <Avatar alt={testimonio.nombre} src={testimonio.imagen} sx={{ width: 80, height: 80 }} />
                </Box>
                <Typography variant="h6" component="div" sx={{ mt: 2, textAlign: "center", color: "inherit" }}>
                  {testimonio.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center", color: "inherit" }}>
                  {testimonio.testimonio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Service;
