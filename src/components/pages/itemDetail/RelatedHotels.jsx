import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Grid, IconButton } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
//import MapComponent from './MapComponent'; // Asegúrate de ajustar la ruta de importación

const RelatedHotels = ({ category }) => {
  const [hotels, setHotels] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    const fetchHotelsByCategory = async () => {
      try {
        const hotelsRef = collection(db, "hotels");
        const q = query(hotelsRef, where("category", "==", category));
        const querySnapshot = await getDocs(q);
        let hotelsData = [];
        querySnapshot.forEach((doc) => {
          hotelsData.push({ id: doc.id, ...doc.data() });
        });
        setHotels(hotelsData);
      } catch (error) {
        console.error("Error al cargar hoteles:", error);
      }
    };

    fetchHotelsByCategory();
  }, [category]);

  const handlePrevImage = (hotelId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [hotelId]: prev[hotelId] > 0 ? prev[hotelId] - 1 : hotels.find(h => h.id === hotelId).image.length - 1,
    }));
  };

  const handleNextImage = (hotelId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [hotelId]: prev[hotelId] < hotels.find(h => h.id === hotelId).image.length - 1 ? prev[hotelId] + 1 : 0,
    }));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Hoteles Relacionados</Typography>
      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel.id}>
            <Card sx={{ display: 'flex', flexDirection: 'row', height:"400px" }}>
              <Box sx={{ width: '50%', position: 'relative' }}>
                {hotel.image.length > 0 && (
                  <>
                    <CardMedia
                      component="img"
                      image={hotel.image[currentImageIndex[hotel.id] || 0]}
                      alt={hotel.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={() => handlePrevImage(hotel.id)}
                      sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleNextImage(hotel.id)}
                      sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </>
                )}
              </Box>
              <CardContent sx={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' , height:"100%"}}>
                <Box>
                  <Typography variant="h6">{hotel.name}</Typography>
                  <Typography variant="body2">{hotel.description}</Typography>
                </Box>
                <Box sx={{ mt: 2, height: '150px', position: 'relative' }}>
                  {hotel.mapUrl ? (
                    <iframe
                      src={hotel.mapUrl}
                      width="100%"
                      height="150"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary" align="center" sx={{ pt: 6 }}>
                      Mapa no disponible
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedHotels;
