import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Divider,
  Box,
  Stack,
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "./useStyles.css";

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.email) {
      const fetchOrders = async () => {
        try {
          const ordersCollection = collection(db, "orders");
          const ordersFiltered = query(
            ordersCollection,
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(ordersFiltered);
          const newArr = querySnapshot.docs.map((order) => {
            const data = order.data();
            return {
              ...data,
              id: order.id,
              date: data.date ? data.date.toDate() : null,
            };
          });
          
          // Ordenar las órdenes por fecha
          newArr.sort((a, b) => b.date - a.date);

          setMyOrders(newArr);
        } catch (error) {
          console.log(error);
        }
      };

      fetchOrders();
    }
  }, [user]);

  return (
    <Box className="container">
      <Typography className="title" variant="h4" gutterBottom>
        Mis Compras
      </Typography>
      <Grid container spacing={3}>
        {myOrders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card className="card">
              <CardContent>
                {order.date && (
                  <Typography className="date" variant="subtitle2" color="textSecondary" gutterBottom>
                    Fecha de compra: {format(order.date, "PPPP p", { locale: es })}
                  </Typography>
                )}
                <Divider />
                {order?.items?.map((product) => (
                  <Stack
                    key={product.id}
                    direction="row"
                    spacing={12}
                    alignItems="center"
                    className="product-details"
                  >
                    <CardMedia
                      className="product-image"
                      component="img"
                      image={product.image} // Asegúrate de que cada producto tenga una propiedad 'image'
                      alt={product.title}
                    />
                    <Box className="product-info">
                      <Typography className="product-title" variant="body1">
                        {order.id}
                      </Typography>
                      <Typography className="product-quantity" variant="body2">
                        Cantidad: {product.quantity}
                      </Typography>
                    </Box>
                    <Typography className="product-price" variant="body2">
                      ${product.unit_price}
                    </Typography>
                  </Stack>
                ))}
                <Divider />
                <Box className="total">
                  <Typography variant="subtitle1">
                    Total de la orden: ${order.total}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserOrders;
