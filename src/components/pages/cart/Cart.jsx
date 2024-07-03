import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Divider } from "@mui/material";

const Cart = () => {
  const { cart, clearCart, deleteById, getTotalPrice } = useContext(CartContext);
  const [total, setTotal] = useState(0);

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Carrito de Compras</Typography>

      {cart.length > 0 ? (
        <Link to="/checkout" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" sx={{ mb: 2 }}>
            Finalizar compra
          </Button>
        </Link>
      ) : (
        <Typography variant="body1" sx={{ mb: 2 }}>
          Tu carrito está vacío
        </Typography>
      )}

      <Button variant="outlined" onClick={handleClearCart} sx={{ mb: 2 }}>
        Limpiar carrito
      </Button>

      {cart.map((product) => (
        <Box key={product.id} sx={{ mb: 2, border: "1px solid #ccc", padding: "10px" }}>
          <Typography variant="h6">{product.title}</Typography>
          <Typography variant="body1">Cantidad: {product.quantity}</Typography>
          <Button variant="outlined" color="error" onClick={() => handleDelete(product.id)} sx={{ mt: 1 }}>
            Eliminar
          </Button>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5">Total a pagar: ${total}</Typography>
    </Box>
  );
};

export default Cart;
