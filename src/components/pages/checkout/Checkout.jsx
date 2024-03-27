import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useContext, useState } from "react";
import { CartContext } from "../../../context/CartContext";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../../firebaseConfig";

import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  //getDocs,
} from "firebase/firestore";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  initMercadoPago(import.meta.env.VITE_PUBLICKEY, { locale: "es-AR", });

  const [preferenceId, setPreferenceId] = useState(null);
  const [userData, setUserData] = useState({
    cp: "",
    phone: "",
  });

  const [orderId, setOrderId] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("status"); //approved --- reject

  useEffect(() => {
    // Verifica si paramValue es "approved"
    if (paramValue === "approved") {
      // Obtén la orden desde el almacenamiento local
      let order = JSON.parse(localStorage.getItem("order"));
  
      // Crea la colección "orders" y agrega la orden
      const ordersCollection = collection(db, "orders");
      addDoc(ordersCollection, { ...order, date: serverTimestamp() })
        .then((res) => {
          // Guarda el ID de la orden creada
          setOrderId(res.id);
        })
        .catch((error) => {
          console.error("Error al agregar la orden:", error);
        });
  
      // Actualiza el stock de los productos
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
  
      // Limpia el almacenamiento local
      localStorage.removeItem("order");
      clearCart();
    }
  }, [paramValue]);
  

  let total = getTotalPrice();

  const createPreference = async () => {
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        quantity: product.quantity,
        unit_price: product.unit_price,
      };
    });
    console.log(newArray);

    try {
      //const {title,quantity,unit_price}=newArray
      const response = await axios.post(
        "https://back-mantra.vercel.app/create_preference",
        {
          items: newArray,
          //title,
          //quantity,
          //unit_price,
          //shipment_cost : 10,
        }
      );

      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
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
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {!orderId ? 
        <>
          <TextField
            name="cp"
            variant="outlined"
            label="codigo postal"
            onChange={handleChange}
          />
          <TextField
            name="phone"
            variant="outlined"
            label="telefono"
            onChange={handleChange}
          />
          <Button onClick={handleBuy}>seleccione medio de pago</Button>
        </>
       : <>
       <h2>El pago se realizo con exito</h2>
       <h3>su numero de compra es {orderId}</h3>
       <Link to="/shop">Seguir comprando</Link>
       </>
        
      }
      {
        preferenceId && (
          <Wallet
            initialization={{
              preferenceId: preferenceId,
              redirectMode: "self",
            }}
          />
        ) //customization={{ texts:{ valueProp: 'smart_option'}}} />
      }
    </div>
  );
};

export default Checkout;
