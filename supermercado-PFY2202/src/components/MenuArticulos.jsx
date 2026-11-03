import { Link, useLocation } from "react-router-dom";

const ENLACES = [
  { to: "/nuevo-articulo", etiqueta: "Ingresar artículo" },
  { to: "/articulos", etiqueta: "Tabla de inventario" },
];

export default function MenuArticulos() {
  const { pathname } = useLocation();

  return (
    <nav className="encabezado__articulos" aria-label="Gestión de artículos">
      {ENLACES.map((enlace) => {
        const activo = pathname === enlace.to;
        return (
          <Link key={enlace.to} to={enlace.to} aria-current={activo ? "page" : undefined}>
            {enlace.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
