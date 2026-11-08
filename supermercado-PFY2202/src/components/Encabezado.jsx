import { Link } from "react-router";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { etiquetaCuenta } from "../data/salas.js";
import MenuArticulos from "./MenuArticulos.jsx";

export default function Encabezado() {
  const { sesion, cerrarSesion } = useSesion();
  const { unidades, abrir } = useCarrito();
  const empresa = sesion?.tipo === "sala" || sesion?.tipo === "administracion";
  const etiqueta = !sesion
    ? ""
    : sesion.tipo === "cliente"
      ? sesion.nombre
      : etiquetaCuenta(sesion.id);

  return (
    <header className="sticky top-0 z-30 border-b-4 border-caqui bg-verde text-papel">
      <div className="mx-auto flex w-[min(1080px,calc(100%-2rem))] flex-wrap items-center justify-between gap-x-11 gap-y-3 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-3 text-papel no-underline">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-caqui font-ui text-sm font-bold text-verde-oscuro">
              PFY
            </span>
            <span className="min-w-0">
              <span className="block font-titulo text-xl font-semibold leading-tight">Supermercado PFY2202</span>
              <span className="block font-texto text-sm text-papel/80">Compra y reposición</span>
            </span>
          </Link>
          {etiqueta ? (
            <p className="flex items-center gap-2 font-ui text-base font-semibold text-caqui">
              <span className="h-2 w-2 rounded-full bg-caqui" aria-hidden="true" />
              {etiqueta}
            </p>
          ) : null}
        </div>
        <div className="ml-auto flex w-full max-w-xl flex-wrap justify-end gap-2 sm:w-auto">
          {empresa ? <MenuArticulos /> : null}
          {empresa ? null : (
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-caqui text-papel hover:bg-caqui hover:text-verde-oscuro"
              onClick={abrir}
              aria-label={
                unidades > 0
                  ? `Abrir carrito, ${unidades} ${unidades === 1 ? "producto" : "productos"}`
                  : "Abrir carrito"
              }
            >
              <IconoCarrito />
              {unidades > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-caqui px-1 font-ui text-xs font-bold text-verde-oscuro">
                  {unidades}
                </span>
              ) : null}
            </button>
          )}
          {sesion ? (
            <button
              type="button"
              className="inline-flex min-h-10 min-w-36 items-center justify-center rounded-lg bg-caqui px-3 py-2 font-ui text-base font-semibold text-verde-oscuro hover:bg-papel"
              onClick={cerrarSesion}
            >
              Salir
            </button>
          ) : (
            <Link
              to="/ingresar"
              className="inline-flex min-h-10 min-w-36 items-center justify-center rounded-lg bg-caqui px-3 py-2 text-center font-ui text-base font-semibold text-verde-oscuro hover:bg-papel"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function IconoCarrito() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
