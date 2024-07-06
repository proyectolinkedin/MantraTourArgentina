import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { getDoc, doc} from "firebase/firestore";
import { Button, Box, Typography, CircularProgress, Alert, CardMedia } from "@mui/material";
import { CartContext } from "../../../context/CartContext";
import RelatedHotels from "./RelatedHotels"; // Importa el componente RelatedHotels
import ExcursionRelated from "./ExcurtionRelated";


const ItemDetail = () => {
  const { id } = useParams();
  const { addToCart, getQuantityById } = useContext(CartContext);
  let quantity = getQuantityById(id);
  const [product, setProduct] = useState(null);
  const [counter, setCounter] = useState(quantity || 2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let productRef = doc(db, "products", id);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          setProduct({ ...productData, id: productSnapshot.id });
        } else {
          setError("Producto no encontrado.");
        }
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
    <Box sx={{ p: 3 }}>
      {product && (
        <Box>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            sx={{ width: '100%', maxHeight: '400px', objectFit: 'contain', cursor: 'pointer' }}
          />
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
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

      {/* Componente RelatedHotels para mostrar hoteles relacionados */}
      {product && (
        <RelatedHotels category={product.category} />
      )}
            {/* Componente ExcursionRelated para mostrar excursiones relacionadas */}
            {product && (
        <ExcursionRelated category={product.category} />
      )}
    </Box>
  );
};

export default ItemDetail;
