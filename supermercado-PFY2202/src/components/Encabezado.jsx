import { Link } from "react-router-dom";
import MenuArticulos from "./MenuArticulos.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { etiquetaCuenta } from "../data/salas.js";

export default function Encabezado() {
  const { sesion, cerrarSesion } = useSesion();

  return (
    <header className="encabezado">
      <div className="encabezado__interno">
        <div className="encabezado__identidad">
          <Link to="/" className="marca">
            <span className="marca__logo" aria-hidden="true">
              PFY
            </span>
            <span>
              <span className="marca__nombre">Supermercado PFY2202</span>
              <span className="marca__detalle">Gestión de inventario</span>
            </span>
          </Link>
          {sesion ? <p className="encabezado__sala">{etiquetaCuenta(sesion.id)}</p> : null}
        </div>
        <div className="encabezado__acceso">
          <MenuArticulos />
          {sesion ? (
            <button type="button" className="encabezado__salir" onClick={cerrarSesion}>
              Salir
            </button>
          ) : (
            <Link to="/ingresar" className="encabezado__ingresar">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
