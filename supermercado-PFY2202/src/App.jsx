import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { ConsultasProvider } from "./context/ConsultasContext.jsx";
import { InventarioProvider } from "./context/InventarioContext.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";
import Contactos from "./pages/Contactos.jsx";
import DetalleConsulta from "./pages/DetalleConsulta.jsx";
import DetalleProducto from "./pages/DetalleProducto.jsx";
import Ingreso from "./pages/Ingreso.jsx";
import Inicio from "./pages/Inicio.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";
import QuienesSomos from "./pages/QuienesSomos.jsx";
import "./App.css";

const raiz = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <SesionProvider>
      <InventarioProvider>
        <ConsultasProvider>
          {/* BrowserRouter usa el historial del navegador y mantiene la SPA sin recargar. */}
          <Router basename={raiz || "/"}>
            <Layout>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                <Route path="/contactos" element={<Contactos />} />
                <Route path="/contactos/:id" element={<DetalleConsulta />} />
                <Route path="/ingresar" element={<Ingreso />} />
                <Route path="/producto/:sala/:id" element={<DetalleProducto />} />
                <Route path="/contacto" element={<Navigate to="/contactos" replace />} />
                {/* La ruta comodín queda al final para no tapar las rutas específicas. */}
                <Route path="*" element={<NoEncontrado />} />
              </Routes>
            </Layout>
          </Router>
        </ConsultasProvider>
      </InventarioProvider>
    </SesionProvider>
  );
}
