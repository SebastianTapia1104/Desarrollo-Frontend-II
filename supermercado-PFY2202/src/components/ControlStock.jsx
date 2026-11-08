import { useState } from "react";
import { useInventario } from "../context/InventarioContext.jsx";

export default function ControlStock({ producto, salaId, puedeEditar, anunciar = false }) {
  const { ajustarStock, fijarStock } = useInventario();
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(String(producto.stock));
  const unidad = producto.unidad === "kg" ? " kg" : "";

  function abrir() {
    if (!puedeEditar) return;
    setTexto(String(producto.stock));
    setEditando(true);
  }

  function confirmar() {
    if (/^\d+$/.test(texto)) {
      fijarStock(salaId, producto.id, Number(texto));
    }
    setEditando(false);
  }

  return (
    <div className="control w-fit justify-self-start">
      <button
        type="button"
        onClick={() => ajustarStock(salaId, producto.id, -1)}
        disabled={!puedeEditar || producto.stock === 0}
        aria-label={`Quitar una unidad de ${producto.nombre}`}
      >
        −
      </button>
      {editando ? (
        <input
          className="control__cantidad"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoFocus
          aria-label={`Cantidad de ${producto.nombre}`}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value.replace(/\D/g, "").slice(0, 3))}
          onBlur={confirmar}
          onKeyDown={(evento) => {
            if (evento.key === "Enter") evento.currentTarget.blur();
            if (evento.key === "Escape") setEditando(false);
          }}
        />
      ) : (
        <button
          type="button"
          className="control__cantidad"
          onClick={abrir}
          disabled={!puedeEditar}
          aria-live={anunciar ? "polite" : undefined}
          aria-label={`Editar la cantidad de ${producto.nombre}. Ahora hay ${producto.stock}`}
        >
          {producto.stock}
          {unidad}
        </button>
      )}
      <button
        type="button"
        onClick={() => ajustarStock(salaId, producto.id, 1)}
        disabled={!puedeEditar || producto.stock >= 999}
        aria-label={`Agregar una unidad de ${producto.nombre}`}
      >
        +
      </button>
    </div>
  );
}
