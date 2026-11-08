import { Link, useLocation } from "react-router";

const ENLACES = [
  { to: "/nuevo-articulo", etiqueta: "Ingresar artículo" },
  { to: "/articulos", etiqueta: "Tabla de inventario" },
];

export default function MenuArticulos() {
  const { pathname } = useLocation();

  return (
    <nav className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Gestión de artículos">
      {ENLACES.map((enlace) => {
        const activo = pathname === enlace.to;
        return (
          <Link
            key={enlace.to}
            to={enlace.to}
            aria-current={activo ? "page" : undefined}
            className={`inline-flex min-h-10 items-center justify-center rounded-lg border border-caqui px-3 py-2 text-center font-ui text-base font-semibold ${
              activo ? "bg-caqui text-verde-oscuro" : "text-papel hover:bg-caqui hover:text-verde-oscuro"
            }`}
          >
            {enlace.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
