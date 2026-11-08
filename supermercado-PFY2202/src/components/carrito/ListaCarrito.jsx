import { Link } from "react-router";
import { formatoPrecio } from "../../utils/formato.js";
import Boton from "../Boton.jsx";

export default function ListaCarrito({ lineas, productos, onCambiar, onQuitar, aviso }) {
  const filas = lineas.map((linea) => ({
    ...linea,
    producto: productos.find((producto) => producto.id === linea.productoId) ?? null,
  }));
  const unidades = filas.reduce((total, fila) => total + fila.cantidad, 0);
  const total = filas.reduce((suma, fila) => suma + fila.cantidad * (fila.producto?.precio ?? 0), 0);

  if (filas.length === 0) {
    return (
      <p className="font-texto text-base">
        El carrito está vacío. Agrega un producto desde el supermercado.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {aviso ? (
        <p className="mb-3 font-texto text-sm text-[#7d3428]" role="alert">
          {aviso}
        </p>
      ) : null}
      <ul className="divide-y divide-caqui/70">
        {filas.map((fila) => (
          <li key={fila.productoId} className="py-3">
            <p className="font-ui font-semibold">
              {fila.producto ? (
                <Link to={`/producto/${fila.salaId}/${fila.productoId}`} className="text-verde underline">
                  {fila.producto.nombre}
                </Link>
              ) : (
                "Artículo ya no disponible"
              )}
            </p>
            <p className="mt-1 font-texto text-sm text-tinta/70">
              {fila.cantidad} × {fila.producto ? formatoPrecio(fila.producto.precio) : "—"} ={" "}
              {fila.producto ? formatoPrecio(fila.cantidad * fila.producto.precio) : "—"}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                className="h-9 w-9 rounded-lg border border-caqui font-ui text-lg disabled:opacity-40"
                onClick={() => onCambiar(fila.productoId, -1)}
                disabled={fila.cantidad <= 1}
                aria-label={`Disminuir ${fila.producto?.nombre ?? "artículo"}`}
              >
                −
              </button>
              <span className="min-w-6 text-center font-ui font-bold">{fila.cantidad}</span>
              <button
                type="button"
                className="h-9 w-9 rounded-lg border border-caqui font-ui text-lg"
                onClick={() => onCambiar(fila.productoId, 1)}
                aria-label={`Aumentar ${fila.producto?.nombre ?? "artículo"}`}
              >
                +
              </button>
              <Boton variante="alerta" className="h-9 px-3 text-sm" onClick={() => onQuitar(fila.productoId)}>
                Quitar
              </Boton>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center justify-between border-t border-caqui pt-3 font-ui font-semibold">
        <span>
          {unidades} {unidades === 1 ? "producto" : "productos"}
        </span>
        <span>Total: {formatoPrecio(total)}</span>
      </p>
    </div>
  );
}
