import { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import './OfertasEspeciales.css';

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
      <Grid container spacing={2} justifyContent="center">
        {ofertas.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <div className="flip-card" onTouchStart={() => {}}>
              <div className="flip-card-inner">
                <Card className="flip-card-front">
                  <CardMedia component="img" image={product.image} alt={product.title} />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {product.title}
                    </Typography>
                  </CardContent>
                </Card>
                <Card
                  className="flip-card-back"
                  sx={{
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onTouchStart={() => {}} // Agregar evento onTouchStart para activar en dispositivos móviles
                >
                  <CardContent className="flip-card-back-content">
                    <Typography variant="h6" component="div" className="text-shadow">
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', marginTop: '8px' }} className="text-shadow">
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OfertasEspeciales;
