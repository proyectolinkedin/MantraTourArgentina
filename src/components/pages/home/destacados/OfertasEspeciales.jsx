import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";

const ofertas = [
  {
    titulo: "Descuento en Hotel",
    imagen: "https://example.com/hotel.jpg",
    descripcion: "30% de descuento en estadías de más de 3 noches.",
  },
  {
    titulo: "Oferta en Vuelo",
    imagen: "https://example.com/flight.jpg",
    descripcion: "20% de descuento en vuelos internacionales.",
  },
];

const OfertasEspeciales = () => {
  return (
    <Grid container spacing={3}>
      {ofertas.map((oferta, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardMedia component="img" height="200" image={oferta.imagen} alt={oferta.titulo} />
            <CardContent>
              <Typography variant="h6" component="div">
                {oferta.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {oferta.descripcion}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default OfertasEspeciales;


