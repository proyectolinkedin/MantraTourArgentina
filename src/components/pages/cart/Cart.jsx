import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Divider, IconButton, Card, CardMedia, CardContent } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const Cart = () => {
  const { cart, clearCart, deleteById, getTotalPrice } = useContext(CartContext);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Función para actualizar el total
  const updateTotal = () => {
    const totalPrice = getTotalPrice();
    setTotal(totalPrice);
  };

  // Actualizar el total cuando el carrito cambie
  useEffect(() => {
    updateTotal();
  }, [cart]);

  const handleClearCart = () => {
    clearCart();
    setTotal(0); // Actualiza el total a 0 inmediatamente
  };

  const handleDelete = (productId) => {
    deleteById(productId);
    // Espera a que se actualice el carrito antes de actualizar el total
    setTimeout(updateTotal, 0);
  };

  const handleCheckout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Vas a proceder con la compra.",
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/logo%20mantra.png?alt=media&token=add80bfd-737e-4d8f-a001-c0a2a43493fc", // Usar la imagen personalizada
      imageWidth: 80,
      imageHeight: 80,
      imageAlt: 'Advertencia personalizada',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, comprar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/checkout');
      }
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>Carrito de Compras</Typography>

      {cart.length > 0 ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              Finalizar compra
            </Button>
            <Typography variant="h5">Total a pagar: ${total}</Typography>
            <IconButton onClick={handleClearCart}>
              <DeleteIcon />
            </IconButton>
          </Box>

          {cart.map((product) => (
            <Card key={product.id} sx={{ display: "flex", mb: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={product.image}
                alt={product.title}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography component="div" variant="h6">
                    {product.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Cantidad: {product.quantity}
                  </Typography>
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </>
      ) : (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Tu carrito está vacío
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {cart.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h5">Total a pagar: ${total}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
