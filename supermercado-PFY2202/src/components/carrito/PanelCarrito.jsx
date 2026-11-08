import { useEffect, useState } from "react";
import { Link } from "react-router";
import Boton from "../Boton.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { useInventario } from "../../context/InventarioContext.jsx";
import { useSesion } from "../../context/SesionContext.jsx";
import { SALAS } from "../../data/salas.js";
import ListaCarrito from "./ListaCarrito.jsx";

export default function PanelCarrito() {
  const { sesion } = useSesion();
  const { productos } = useInventario();
  const { lineas, salaId, abierto, cerrar, cambiar, quitar } = useCarrito();
  const [aviso, setAviso] = useState("");
  const sala = SALAS.find((item) => item.id === salaId);
  const empresa = sesion?.tipo === "sala" || sesion?.tipo === "administracion";

  useEffect(() => {
    if (!abierto) return undefined;
    function alTeclado(evento) {
      if (evento.key === "Escape") cerrar();
    }
    document.addEventListener("keydown", alTeclado);
    return () => document.removeEventListener("keydown", alTeclado);
  }, [abierto, cerrar]);

  if (empresa) return null;

  function ajustar(productoId, delta) {
    const error = cambiar(productoId, delta);
    setAviso(error);
  }

  return (
    <div className={abierto ? "fixed inset-0 z-40" : "pointer-events-none fixed inset-0 z-40"}>
      <button
        type="button"
        className={`absolute inset-0 bg-verde-oscuro/40 ${abierto ? "" : "hidden"}`}
        aria-label="Cerrar carrito"
        onClick={cerrar}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-[min(100%,24rem)] flex-col border-l-4 border-caqui bg-papel p-4 transition-transform ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!abierto}
        inert={!abierto ? true : undefined}
        aria-label="Carrito de compras"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-titulo text-2xl font-semibold">Carrito de compras</h2>
            {sala ? <p className="font-texto text-sm text-tinta/70">Sala {sala.nombre}</p> : null}
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-caqui font-ui text-xl"
            onClick={cerrar}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
          {sesion?.tipo === "cliente" ? (
            <ListaCarrito
              lineas={lineas}
              productos={productos}
              aviso={aviso}
              onCambiar={ajustar}
              onQuitar={(productoId) => {
                setAviso("");
                quitar(productoId);
              }}
            />
          ) : (
            <p className="font-texto">
              Inicia sesión para guardar el carrito.{" "}
              <Link to="/ingresar" className="font-semibold text-verde underline" onClick={cerrar}>
                Iniciar sesión
              </Link>
            </p>
          )}
        </div>
        {sesion?.tipo === "cliente" ? (
          <Boton to="/carrito" variante="secundario" className="mt-4 w-full" onClick={cerrar}>
            Detalle carrito
          </Boton>
        ) : null}
      </aside>
    </div>
  );
}
