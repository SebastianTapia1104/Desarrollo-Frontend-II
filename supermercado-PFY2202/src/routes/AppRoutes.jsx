import { Navigate, Route, Routes } from "react-router";
import { useSesion } from "../context/SesionContext.jsx";
import Carrito from "../pages/Carrito.jsx";
import Contactos from "../pages/Contactos.jsx";
import DetalleConsulta from "../pages/DetalleConsulta.jsx";
import DetalleProducto from "../pages/DetalleProducto.jsx";
import IngresoClientes from "../pages/IngresoClientes.jsx";
import IngresoEmpresa from "../pages/IngresoEmpresa.jsx";
import Inventario from "../pages/Inventario.jsx";
import NoEncontrado from "../pages/NoEncontrado.jsx";
import NuevoArticulo from "../pages/NuevoArticulo.jsx";
import QuienesSomos from "../pages/QuienesSomos.jsx";
import Supermercado from "../pages/Supermercado.jsx";
import TablaArticulos from "../pages/TablaArticulos.jsx";

function RutaEmpresa({ children }) {
  const { sesion } = useSesion();
  if (sesion?.tipo === "cliente") return <Navigate to="/" replace />;
  return children;
}

function RutaCliente({ children }) {
  const { sesion } = useSesion();
  if (sesion?.tipo !== "cliente") return <Navigate to="/ingresar" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Supermercado />} />
      <Route
        path="/inventario"
        element={
          <RutaEmpresa>
            <Inventario />
          </RutaEmpresa>
        }
      />
      <Route
        path="/carrito"
        element={
          <RutaCliente>
            <Carrito />
          </RutaCliente>
        }
      />
      <Route path="/quienes-somos" element={<QuienesSomos />} />
      <Route path="/contactos" element={<Contactos />} />
      <Route path="/contactos/:id" element={<DetalleConsulta />} />
      <Route path="/ingresar" element={<IngresoClientes />} />
      <Route path="/ingresar-empresa" element={<IngresoEmpresa />} />
      <Route path="/producto/:sala/:id" element={<DetalleProducto />} />
      <Route
        path="/nuevo-articulo"
        element={
          <RutaEmpresa>
            <NuevoArticulo />
          </RutaEmpresa>
        }
      />
      <Route
        path="/editar-articulo/:id"
        element={
          <RutaEmpresa>
            <NuevoArticulo />
          </RutaEmpresa>
        }
      />
      <Route
        path="/articulos"
        element={
          <RutaEmpresa>
            <TablaArticulos />
          </RutaEmpresa>
        }
      />
      <Route path="/contacto" element={<Navigate to="/contactos" replace />} />
      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}
