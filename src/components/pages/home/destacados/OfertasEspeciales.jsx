import { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig"; // Asegúrate de importar tu configuración de Firebase

const OfertasEspeciales = () => {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const ofertasCollection = collection(db, "products");
        const ofertasSnapshot = await getDocs(ofertasCollection);
        const ofertasList = ofertasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOfertas(ofertasList);
      } catch (error) {
        console.error("Error fetching destinos: ", error);
      }
    };

    fetchOfertas();
  }, []);
  return (
    <Box>
    <Grid container spacing={5}>
      {ofertas.map((products) => (
        <Grid item xs={12} sm={6} md={4} key={products.id}>
          <Card>
            <CardMedia component="img" height="200" image={products.image} alt={products.title} />
            <CardContent>
              <Typography variant="h6" component="div">
                {products.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {products.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  );
};

export default OfertasEspeciales;


