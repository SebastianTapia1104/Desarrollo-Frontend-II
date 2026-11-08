import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useCarrito } from "../../context/CarritoContext.jsx";
import { useSesion } from "../../context/SesionContext.jsx";

export default function BotonAgregar({ salaId, productoId, stock, completo = false }) {
  const { sesion } = useSesion();
  const { lineas, agregar, abrir } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const enCarrito = lineas.some((linea) => linea.productoId === productoId && linea.salaId === salaId);
  const sinStock = stock < 1 && !enCarrito;

  function pulsar() {
    if (sesion?.tipo !== "cliente") {
      navigate("/ingresar", { state: { desde: `${location.pathname}${location.search}` } });
      return;
    }
    if (enCarrito) {
      setError("");
      abrir();
      return;
    }
    setError(agregar(salaId, productoId, 1));
  }

  return (
    <div className={completo ? "grid gap-1" : "grid max-w-xs gap-1"}>
      <button
        type="button"
        onClick={pulsar}
        disabled={sinStock}
        className={`inline-flex h-11 w-full items-center justify-center rounded-lg px-4 font-ui text-base font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${
          enCarrito ? "bg-verde text-papel" : "bg-caqui text-verde-oscuro hover:bg-papel"
        }`}
      >
        {sinStock ? "Sin stock" : enCarrito ? "En el carrito" : "Añadir al carrito"}
      </button>
      {error ? (
        <p className="font-texto text-sm text-[#7d3428]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
