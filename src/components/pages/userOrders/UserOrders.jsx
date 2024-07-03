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

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Asegúrate de que user y user.email estén definidos antes de hacer la consulta
    if (user && user.email) {
      const fetchOrders = async () => {
        try {
          const ordersCollections = collection(db, "orders");
          const ordersFiltered = query(
            ordersCollections,
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(ordersFiltered);
          const newArr = querySnapshot.docs.map((order) => ({
            ...order.data(),
            id: order.id,
          }));
          setMyOrders(newArr);
        } catch (error) {
          console.log(error);
        }
      };

      fetchOrders();
    }
  }, [user]);

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Mis Órdenes
      </Typography>
      <Grid container spacing={3}>
        {myOrders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Orden ID: {order.id}
                </Typography>
                <Divider />
                {order?.items?.map((product) => (
                  <Stack
                    key={product.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ padding: "1rem 0" }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image} // Asegúrate de que cada producto tenga una propiedad 'image'
                      alt={product.title}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{product.title}</Typography>
                      <Typography variant="body2">Cantidad: {product.quantity}</Typography>
                    </Box>
                    <Typography variant="body2">${product.unit_price}</Typography>
                  </Stack>
                ))}
                <Divider />
                <Box sx={{ padding: "1rem 0" }}>
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
