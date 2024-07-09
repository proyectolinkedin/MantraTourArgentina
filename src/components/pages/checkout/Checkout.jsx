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
    if (paramValue === "approved") {
      let order = JSON.parse(localStorage.getItem("order"));

      const ordersCollection = collection(db, "orders");
      addDoc(ordersCollection, { ...order, date: serverTimestamp() })
        .then((res) => {
          setOrderId(res.id);
        })
        .catch((error) => {
          console.error("Error al agregar la orden:", error);
        });

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

      localStorage.removeItem("order");
      clearCart();
      navigate("/shop");
    }
  }, [paramValue, navigate]);

  let total = getTotalPrice();

  const createPreference = async () => {
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        quantity: product.quantity,
        unit_price: product.unit_price,
      };
    });

    try {
      const response = await axios.post(
        "https://back-mantra.vercel.app/create_preference",
        {
          items: newArray,
        }
      );

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
          items: cart,
          total: total,
          email: user.email,
        };
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
          <Typography variant="h4" gutterBottom>
            Checkout
          </Typography>
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
          <Typography variant="h4" gutterBottom>
            El pago se realizó con éxito
          </Typography>
          <Typography variant="h6">
            Su número de compra es {orderId}
          </Typography>
          <Button component={Link} to="/shop" variant="contained" sx={{ mt: 2 }}>
            Seguir comprando
          </Button>
        </>
      )}
      {preferenceId && (
        <Box sx={{ mt: 4 }}>
          <Wallet
            initialization={{
              preferenceId: preferenceId,
              redirectMode: "modal",
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default Checkout;
