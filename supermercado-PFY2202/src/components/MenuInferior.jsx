import { Link, useLocation } from "react-router-dom";

const ENLACES = [
  { to: "/", etiqueta: "Inventario", icono: <IconoInicio /> },
  { to: "/quienes-somos", etiqueta: "Quiénes somos", icono: <IconoNosotros /> },
  { to: "/contactos", etiqueta: "Contactos", icono: <IconoContacto /> },
];

function esActivo(pathname, to) {
  if (to === "/") {
    return pathname === "/" || pathname.startsWith("/producto");
  }

  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function MenuInferior() {
  const location = useLocation();

  return (
    <nav className="menu-inferior" aria-label="Secciones del sitio">
      <ul>
        {ENLACES.map((enlace) => {
          const activo = esActivo(location.pathname, enlace.to);

          return (
            <li key={enlace.to}>
              <Link
                to={enlace.to}
                className={
                  activo
                    ? "menu-inferior__link menu-inferior__link--activo"
                    : "menu-inferior__link"
                }
                aria-current={activo ? "page" : undefined}
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
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoNosotros() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="10" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.8 18.5c.6-2.4 2.4-3.7 4.2-3.7s3.6 1.3 4.2 3.7M14 14.9c1.3-.4 2.6.1 3.4 1.1.7.8 1 1.7 1.2 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconoContacto() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m5 7 7 6 7-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
