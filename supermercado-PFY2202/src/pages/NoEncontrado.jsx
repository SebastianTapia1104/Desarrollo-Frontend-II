import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo.js";

export default function NoEncontrado() {
  useTitulo("Página no encontrada");

  return (
    <article className="pagina pagina--centro">
      <p className="eyebrow">Error 404</p>
      <h1>No encontramos esa página</h1>
      <p className="lead">
        La dirección no corresponde a una sección de Supermercado PFY2202. Vuelve al inventario
        para seguir con la sala.
      </p>
      <Link to="/" className="boton">
        Ir al inventario
      </Link>
    </article>
  );
}
