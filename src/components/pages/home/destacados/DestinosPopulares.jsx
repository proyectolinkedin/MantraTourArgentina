import { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig"; // Asegúrate de importar tu configuración de Firebase

const DestinosPopulares = () => {
  const [destinos, setDestinos] = useState([]);

  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        const destinosCollection = collection(db, "products");
        const destinosSnapshot = await getDocs(destinosCollection);
        const destinosList = destinosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDestinos(destinosList);
      } catch (error) {
        console.error("Error fetching destinos: ", error);
      }
    };

    fetchDestinos();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Destinos Populares
      </Typography>
      <Grid container spacing={2}>
        {destinos.map((products) => (
          <Grid item xs={12} sm={6} md={4} key={products.id}>
            <Card sx={{ transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)" } }}>
              <CardMedia
                component="img"
                height="200"
                image={products.image}
                alt={products.titulo}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {products.title}
                </Typography>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DestinosPopulares;

