import { useInventario } from "../context/InventarioContext.jsx";

export default function ControlStock({ producto, salaId, puedeEditar, anunciar = false }) {
  const { ajustarStock } = useInventario();
  const unidad = producto.unidad === "kg" ? " kg" : "";

  return (
    <div className="control">
      <button
        type="button"
        onClick={() => ajustarStock(salaId, producto.id, -1)}
        disabled={!puedeEditar || producto.stock === 0}
        aria-label={`Quitar una unidad de ${producto.nombre}`}
      >
        −
      </button>
      <span aria-live={anunciar ? "polite" : undefined}>
        {producto.stock}
        {unidad}
      </span>
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
