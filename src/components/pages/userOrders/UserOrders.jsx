import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";

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

  console.log(myOrders);
  return (
    <div>
      <h1>Estoy en mis órdenes</h1>
      {myOrders.map((order) => (
        <div key={order.id} style={{ border: "2px solid black" }}>
          {order?.items?.map((product) => (
            <div key={product.id}>
              <h2>{product.title}</h2>
              <h3>{product.quantity}</h3>
            </div>
          ))}
          <h4>El total de la orden es {order.total}</h4>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;

