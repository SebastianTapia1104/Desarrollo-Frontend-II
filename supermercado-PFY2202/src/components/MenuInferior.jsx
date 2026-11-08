import { Link, useLocation } from "react-router";
import { useSesion } from "../context/SesionContext.jsx";

function esActivo(pathname, to, empresa) {
  if (to === "/") {
    return pathname === "/" || pathname.startsWith("/producto") || pathname.startsWith("/carrito");
  }
  if (to === "/inventario" && empresa) {
    return pathname === "/inventario" || pathname.startsWith("/producto") || pathname.startsWith("/articulos") || pathname.startsWith("/nuevo-articulo") || pathname.startsWith("/editar-articulo");
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function MenuInferior() {
  const { sesion } = useSesion();
  const location = useLocation();
  const empresa = sesion?.tipo === "sala" || sesion?.tipo === "administracion";
  const enlaces = [
    empresa
      ? { to: "/inventario", etiqueta: "Inventario", icono: <IconoInicio /> }
      : { to: "/", etiqueta: "Supermercado", icono: <IconoInicio /> },
    { to: "/quienes-somos", etiqueta: "Quiénes somos", icono: <IconoNosotros /> },
    { to: "/contactos", etiqueta: "Contactos", icono: <IconoContacto /> },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t-4 border-caqui bg-verde-oscuro" aria-label="Secciones del sitio">
      <ul className="mx-auto flex w-[min(720px,100%)] list-none gap-1 px-2 py-2">
        {enlaces.map((enlace) => {
          const activo = esActivo(location.pathname, enlace.to, empresa);
          return (
            <li key={enlace.to} className="flex-1">
              <Link
                to={enlace.to}
                aria-current={activo ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-center font-ui text-xs font-semibold ${
                  activo ? "text-papel underline decoration-caqui decoration-2 underline-offset-4" : "text-caqui"
                }`}
              >
                {enlace.icono}
                <span>{enlace.etiqueta}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function IconoInicio() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconoNosotros() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <circle cx="9" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="10" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.8 18.5c.6-2.4 2.4-3.7 4.2-3.7s3.6 1.3 4.2 3.7M14 14.9c1.3-.4 2.6.1 3.4 1.1.7.8 1 1.7 1.2 2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconoContacto() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m5 7 7 6 7-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
