import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import { Button, Box, Typography, CircularProgress, Alert, CardMedia, Grid, Modal } from "@mui/material";
import { CartContext } from "../../../context/CartContext";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ItemDetail = () => {
  const { id } = useParams();
  const { addToCart, getQuantityById } = useContext(CartContext);
  let quantity = getQuantityById(id);
  const [product, setProduct] = useState(null);
  const [counter, setCounter] = useState(quantity || 2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1); // Estado para rastrear qué imagen está siendo hover

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let refCollection = collection(db, "products");
        let refDoc = doc(refCollection, id);
        const res = await getDoc(refDoc);
        setProduct({ ...res.data(), id: res.id });
      } catch (error) {
        setError("Error al cargar el producto. Intenta de nuevo más tarde.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addOne = () => {
    if (counter < product.stock) {
      setCounter(counter + 1);
    } else {
      alert("Stock máximo alcanzado");
    }
  };

  const subOne = () => {
    if (counter > 2) {
      setCounter(counter - 1);
    } else {
      alert("No puedes agregar menos de un elemento");
    }
  };

  const onAdd = () => {
    let obj = {
      ...product,
      quantity: counter,
    };
    addToCart(obj);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? product.relatedImages.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === product.relatedImages.length - 1 ? 0 : prevIndex + 1));
  };

  const openZoomModal = (index) => {
    setCurrentIndex(index);
    setIsZoomOpen(true);
  };

  const closeZoomModal = () => {
    setIsZoomOpen(false);
  };

  const handleImageHover = (index) => {
    setHoveredIndex(index);
  };



  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3}}>
      {product && (
        <Box>
          
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            sx={{ width: '100%', maxHeight: '400px', objectFit: 'contain', cursor: 'pointer' }}
            onClick={() => openZoomModal(currentIndex)}
          />
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center'}}>
            {product.description}

          </Typography>
          <Typography variant="h6">Precio: ${product.unit_price}</Typography>
          <Typography variant="h6">Stock: {product.stock}</Typography>
        </Box>
      )}
      {quantity && (
        <Alert severity="info">Ya tienes {quantity} en el carrito</Alert>
      )}
      {product?.stock === quantity && (
        <Alert severity="warning">Ya tienes el máximo stock en el carrito</Alert>
      )}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Button variant="contained" onClick={addOne}>+</Button>
        <Typography variant="h6" sx={{ mx: 2 }}>{counter}</Typography>
        <Button variant="contained" onClick={subOne}>-</Button>
      </Box>
      <Button variant="contained" color="primary" onClick={onAdd} sx={{ mt: 2 }}>
        Agregar al carrito
      </Button>
      {product?.relatedImages && product.relatedImages.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Imágenes Relacionadas</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ArrowBackIosIcon onClick={handlePrevClick} sx={{ cursor: 'pointer' }} />
            <Grid container spacing={2} sx={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
              {product.relatedImages.map((img, index) => (
                <Grid item key={index} sx={{ minWidth: 120 }}>
                  <CardMedia
                    component="img"
                    image={img}
                    alt={`Related ${index}`}
                    sx={{
                      width: '100%',
                      height: 100,
                      objectFit: 'cover',
                      cursor: 'pointer',
                      filter: hoveredIndex === index ? 'none' : 'grayscale(100%)',
                      transition: 'filter 0.3s ease-in-out',
                    }}
                    onClick={() => openZoomModal(index)}
                    onMouseEnter={() => handleImageHover(index)}
                    onMouseLeave={() => handleImageHover(-1)}
                  />
                </Grid>
                
              )
              )}
            </Grid>
            <ArrowForwardIosIcon onClick={handleNextClick} sx={{ cursor: 'pointer' }} />
          </Box>
        </Box>
      )}

      {/* Modal de Zoom */}
      <Modal open={isZoomOpen} onClose={closeZoomModal} aria-labelledby="zoom-modal-title" aria-describedby="zoom-modal-description">
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }}>
          <CardMedia
            component="img"
            image={product.relatedImages[currentIndex]}
            alt={`Zoomed ${currentIndex}`}
            sx={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ItemDetail;
