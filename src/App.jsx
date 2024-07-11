//import  from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import CartContextComponent from "./context/CartContext";
import AuthContextComponent from "./context/AuthContext";
import WhatsAppButton from "./components/layout/navbar/WhatsAppButton"; // Asegúrate de actualizar la ruta según sea necesario

function App() {
  return (
    <BrowserRouter>
      <AuthContextComponent>
        <CartContextComponent>
          <AppRouter />
          <WhatsAppButton phoneNumber="123456789" defaultMessage="Hola, ¿cómo puedo ayudarte?" />
        </CartContextComponent>
      </AuthContextComponent>
    </BrowserRouter>
  );
}

export default App;
