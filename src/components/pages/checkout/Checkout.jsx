import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../../context/CartContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import axios from "axios";
import { addDoc, collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Swal from "sweetalert2";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  initMercadoPago(import.meta.env.VITE_PUBLICKEY, { locale: "es-AR" });

  const [preferenceId, setPreferenceId] = useState(null);
  const [userData, setUserData] = useState({ cp: "", phone: "" });
  const [orderId, setOrderId] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("status"); // approved --- reject

  useEffect(() => {
    let order = JSON.parse(localStorage.getItem("order"));
    if (paramValue === "approved") {
      
    //  console.log("Order retrieved from localStorage:", order); // Debug log

      
        let ordersCollection = collection(db, "orders");
        addDoc(ordersCollection, { ...order, date: serverTimestamp() })
          .then((res) => {
            console.log("Order added to Firestore with ID:", res.id); // Debug log
            setOrderId(res.id);
            order.items.forEach((element) => {
              updateDoc(doc(db, "products", element.id), {
                stock: element.stock - element.quantity,
              })
                .then(() => {
                  console.log("Stock actualizado para el producto:", element.id);
                })
                .catch((error) => {
                  console.error("Error al actualizar el stock:", error);
                });
            });
          })
          .catch((error) => {
            console.error("Error al agregar la orden:", error);
          });

        localStorage.removeItem("order");
        clearCart();
      } else {
        console.error("No order found in localStorage or order.items is missing");
      
    }
  }, [paramValue, navigate, clearCart]);

  let total = getTotalPrice();

  const createPreference = async () => {
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        quantity: product.quantity,
        unit_price: product.unit_price,
        //currency_id: "ARS"  // Asegúrate de que la moneda esté especificada correctamente
      };
    });

    console.log("Items being sent to create_preference:", newArray); // Debug log

    try {
      const response = await axios.post(
        "https://back-mantra.vercel.app/create_preference",
       // "http://localhost:8080/create_preference",
        {
          items: newArray,
        }
      );

      console.log("Response from create_preference:", response.data); // Debug log

      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Confirmarás tu compra",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar compra'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let order = {
          cp: userData.cp,
          phone: userData.phone,
          items: cart.map(item => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            unit_price: item.unit_price,
            stock: item.stock
          })),
          total: total,
          email: user.email,
        };
        console.log("Order to be saved:", order); // Debug log
        localStorage.setItem("order", JSON.stringify(order));
        const id = await createPreference();
        if (id) {
          setPreferenceId(id);
        }
      }
    });
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {!orderId ? (
        <>
          <Typography variant="h4" gutterBottom>Checkout</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="cp"
              variant="outlined"
              label="Código Postal"
              onChange={handleChange}
              value={userData.cp}
            />
            <TextField
              name="phone"
              variant="outlined"
              label="Teléfono"
              onChange={handleChange}
              value={userData.phone}
            />
            <Button variant="contained" color="primary" onClick={handleBuy}>
              Seleccione medio de pago
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>El pago se realizó con éxito</Typography>
          <Typography variant="h6">Su número de compra es {orderId}</Typography>
          <Button component={Link} to="/shop" variant="contained" sx={{ mt: 2 }}>
            Seguir comprando
          </Button>
        </>
      )}
      {preferenceId && (
        
          <Wallet
            initialization={{
              preferenceId: preferenceId,
              redirectMode: "self",
            }}
          />
        
      )}
    </Container>
  );
};

export default Checkout;
