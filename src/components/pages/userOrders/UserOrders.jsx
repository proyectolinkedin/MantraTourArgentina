import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection, query, where, doc, getDoc } from "firebase/firestore";
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
  Button,
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
          const ordersWithImages = await Promise.all(
            querySnapshot.docs.map(async (order) => {
              const data = order.data();
              const itemsWithImages = await Promise.all(
                data.items.map(async (item) => {
                  const productDoc = await getDoc(doc(db, "products", item.id));
                  return { ...item, image: productDoc.data().image };
                })
              );
              return {
                ...data,
                id: order.id,
                date: data.date ? data.date.toDate() : null,
                items: itemsWithImages,
              };
            })
          );

          // Ordenar las órdenes por fecha
          ordersWithImages.sort((a, b) => b.date - a.date);

          setMyOrders(ordersWithImages);
        } catch (error) {
          console.log(error);
        }
      };

      fetchOrders();
    }
  }, [user]);

  const generateOrderPDF = async (order) => {
    const doc = new jsPDF();
    const logoUrl = "https://firebasestorage.googleapis.com/v0/b/mantratour-37a6e.appspot.com/o/logo%20mantra.png?alt=media&token=add80bfd-737e-4d8f-a001-c0a2a43493fc";

    // Cargar el logo
    const logoImage = new Image();
    logoImage.src = logoUrl;

    // Esperar a que la imagen se cargue
    await new Promise((resolve) => {
      logoImage.onload = resolve;
    });

    // Añadir el logo en la parte superior derecha
    doc.addImage(logoImage, "PNG", 160, 10, 40, 20);

    // Título del documento
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Detalles de la Orden", 105, 20, { align: "center" });

    // Información de la orden
    doc.setFontSize(12);
    doc.text(`ID de la Orden: ${order.id}`, 20, 40);
    doc.text(`Fecha de la Orden: ${order.date ? format(order.date, "PPPP p", { locale: es }) : "No disponible"}`, 20, 50);
    doc.text(`Correo Electrónico: ${order.email}`, 20, 60);

    // Espacio para la tabla
    const head = [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']];
    const body = order.items.map((item) => [
      item.title,
      item.quantity,
      `$${item.unit_price.toFixed(2)}`,
      `$${(item.unit_price * item.quantity).toFixed(2)}`,
    ]);

    // Configuración y generación de la tabla
    autoTable(doc, {
      head,
      body,
      startY: 70,
      styles: {
        halign: 'center',
        valign: 'middle',
        fontSize: 10,
      },
      headStyles: {
        fillColor: [40, 40, 40],
        textColor: [255, 255, 255],
      },
      columnStyles: {
        0: { halign: 'left' }, // Nombre del producto alineado a la izquierda
      },
    });

    // Agregar imágenes de los productos
    let yPosition = doc.lastAutoTable.finalY + 10;
    for (const item of order.items) {
      if (item.image) {
        try {
          const img = new Image();
          img.src = item.image;
          await new Promise((resolve) => {
            img.onload = () => {
              doc.addImage(img, "JPEG", 20, yPosition, 50, 50);
              yPosition += 60; // Espacio entre imágenes
              resolve();
            };
          });
        } catch (error) {
          console.error("Error al cargar la imagen:", error);
        }
      }
    }

    // Total de la orden
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(`Total de la Orden: $${order.total.toFixed(2)}`, 20, yPosition + 10);

    // Descargar el PDF
    doc.save(`order_${order.id}.pdf`);
  };

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
                        {product.title}
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
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => generateOrderPDF(order)}
                  sx={{ mt: 2 }}
                >
                  Descargar PDF
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserOrders;
