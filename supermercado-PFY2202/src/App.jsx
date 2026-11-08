import { BrowserRouter as Router } from "react-router";
import Layout from "./components/Layout.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { ConsultasProvider } from "./context/ConsultasContext.jsx";
import { InventarioProvider } from "./context/InventarioContext.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import "./App.css";

const raiz = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <SesionProvider>
      <InventarioProvider>
        <CarritoProvider>
          <ConsultasProvider>
            <Router basename={raiz || "/"}>
              <Layout>
                <AppRoutes />
              </Layout>
            </Router>
          </ConsultasProvider>
        </CarritoProvider>
      </InventarioProvider>
    </SesionProvider>
  );
}
