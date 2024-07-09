import { useState , useEffect} from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const ExcursionRelated = ({ category }) => {
  const [excursions, setExcursions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedExcursion, setSelectedExcursion] = useState(null);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedExcursion(null);
  };

  const handleOpenModal = (excursion) => {
    setSelectedExcursion(excursion);
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchExcursionsByCategory = async () => {
      try {
        const excursionsRef = collection(db, "excurtions"); // Supongo que es un error de tipeo, debería ser "excursions"
        const q = query(excursionsRef, where("category", "==", category));
        const querySnapshot = await getDocs(q);
        let excursionsData = [];
        querySnapshot.forEach((doc) => {
          excursionsData.push({ id: doc.id, ...doc.data() });
        });
        setExcursions(excursionsData);
      } catch (error) {
        console.error("Error al cargar excursiones:", error);
      }
    };

    fetchExcursionsByCategory();
  }, [category]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Excursiones Relacionadas</Typography>
      <Grid container spacing={3}>
        {excursions.map((excursion) => (
          <Grid item xs={12} sm={6} md={4} key={excursion.id}>
            <Card
              sx={{ display: 'flex', flexDirection: 'row', height: "400px", cursor: 'pointer' }}
              onClick={() => handleOpenModal(excursion)}
            >
              <Box sx={{ width: '50%', position: 'relative' }}>
                {excursion.image.length > 0 && (
                  <CardMedia
                    component="img"
                    image={excursion.image}
                    alt={excursion.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </Box>
              <CardContent sx={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: "100%" }}>
                <Box>
                  <Typography variant="h6">{excursion.name}</Typography>
                  <Typography variant="body2">{excursion.description}</Typography>
                </Box>
                <Box sx={{ mt: 2, height: '150px', position: 'relative' }}>
                  {excursion.mapUrl ? (
                    <iframe
                      src={excursion.mapUrl}
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

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        {selectedExcursion && (
          <>
            <DialogTitle>{selectedExcursion.name}</DialogTitle>
            <DialogContent dividers>
              {selectedExcursion.image && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <CardMedia
                    component="img"
                    image={selectedExcursion.image}
                    alt={selectedExcursion.name}
                    style={{ maxHeight: 400 }}
                  />
                </Box>
              )}
              <Typography variant="body1">{selectedExcursion.extend}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ExcursionRelated;
