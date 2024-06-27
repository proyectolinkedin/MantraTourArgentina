import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";

const TestimoniosClientes = () => {
  const testimonios = [
    {
      nombre: "Juan Pérez",
      imagen: "https://example.com/juan.jpg",
      testimonio: "¡Un viaje increíble! Todo fue perfecto gracias a la organización de la agencia."
    },
    {
      nombre: "Ana Gómez",
      imagen: "https://example.com/ana.jpg",
      testimonio: "La mejor experiencia de mi vida. Recomiendo esta agencia a todos."
    },
    {
      nombre: "Carlos Díaz",
      imagen: "https://example.com/carlos.jpg",
      testimonio: "Excelente servicio y atención al cliente. Volveré a viajar con ellos."
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Testimonios de Clientes
      </Typography>
      <Grid container spacing={2}>
        {testimonios.map((testimonio, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)" } }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar alt={testimonio.nombre} src={testimonio.imagen} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" component="div">
                      {testimonio.nombre}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
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

export default TestimoniosClientes;

