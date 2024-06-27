import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import { Button, Box, Typography, CircularProgress, Alert } from "@mui/material";
import { CartContext } from "../../../context/CartContext";

const ItemDetail = () => {
  const { id } = useParams();
  const { addToCart, getQuantityById } = useContext(CartContext);
  let quantity = getQuantityById(id);
  const [product, setProduct] = useState(null);
  const [counter, setCounter] = useState(quantity || 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  //sumar
  const addOne = () => {
    if (counter < product.stock) {
      setCounter(counter + 1);
    } else {
      alert("Stock máximo alcanzado");
    }
  };

  //restar
  const subOne = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    } else {
      alert("No puedes agregar menos de un elemento");
    }
  };

  //agregar al carrito
  const onAdd = () => {
    let obj = {
      ...product,
      quantity: counter,
    };
    console.log(obj);
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
      <Typography variant="h4" gutterBottom>Detalle del Producto</Typography>
      {product && (
        <Box>
          <Typography variant="h5">{product.title}</Typography>
          <img src={product.image} style={{ width: "200px" }} alt={product.title} />
          <Typography variant="body1">{product.description}</Typography>
          <Typography variant="h6">Precio: ${product.price}</Typography>
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
    </Box>
  );
};

export default ItemDetail;
