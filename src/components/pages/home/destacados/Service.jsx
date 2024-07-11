import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Service = () => {
  const [service, setService] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'service'));

        const serviceData = [];
        querySnapshot.forEach((doc) => {
          const { name, image, description } = doc.data();
          serviceData.push({ nombre: name, imagen: image, testimonio: description });
        });

        setService(serviceData);
      } catch (error) {
        console.error('Error fetching testimonios:', error);
      }
    };

    fetchService();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 2, textAlign: 'center', color: 'inherit' }}>
        Nuestros Servicios
      </Typography>
      <Grid container spacing={2}>
        {service.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: '#ffffff',
                transition: 'background-color 0.3s, color 0.3s',
                '&:hover': {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                  }}
                >
                  <Avatar alt={service.nombre} src={service.imagen} sx={{ width: 80, height: 80 }} />
                </Box>
                <Typography variant="h6" component="div" sx={{ mt: 2, textAlign: 'center', color: 'inherit' }}>
                  {service.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center', color: 'inherit' }}>
                  {service.testimonio}
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
