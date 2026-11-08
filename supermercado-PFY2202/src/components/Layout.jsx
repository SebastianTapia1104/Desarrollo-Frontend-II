import PanelCarrito from "./carrito/PanelCarrito.jsx";
import Encabezado from "./Encabezado.jsx";
import MenuInferior from "./MenuInferior.jsx";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Encabezado />
      <main className="contenido" id="contenido">
        {children}
      </main>
      <MenuInferior />
      <PanelCarrito />
    </div>
  );
}
