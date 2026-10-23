import { Link } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";
import { etiquetaCuenta } from "../data/salas.js";

export default function Encabezado() {
  const { sesion, cerrarSesion } = useSesion();

  return (
    <header className="encabezado">
      <div className="encabezado__interno">
        <Link to="/" className="marca">
          <span className="marca__logo" aria-hidden="true">
            PFY
          </span>
          <span>
            <span className="marca__nombre">Supermercado PFY2202</span>
            <span className="marca__detalle">Gestión de inventario</span>
          </span>
        </Link>
        <div className="encabezado__acceso">
          {sesion ? (
            <>
              <p className="encabezado__sala">{etiquetaCuenta(sesion.id)}</p>
              <button type="button" className="encabezado__salir" onClick={cerrarSesion}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/ingresar" className="encabezado__sala encabezado__ingresar">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
