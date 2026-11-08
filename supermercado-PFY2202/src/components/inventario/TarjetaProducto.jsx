import { Link } from "react-router";
import { formatoPrecio } from "../../utils/formato.js";
import BarraStock from "../BarraStock.jsx";
import BotonAgregar from "../carrito/BotonAgregar.jsx";
import ControlStock from "../ControlStock.jsx";
import IconoCategoria from "../IconoCategoria.jsx";

export default function TarjetaProducto({ producto, salaId, puedeEditar = false, compra = false }) {
  return (
    <article className="rounded-2xl border border-caqui bg-papel p-4">
      <div className="flex items-start gap-3">
        <IconoCategoria categoria={producto.categoria} />
        <div className="min-w-0 flex-1">
          <h2 className="font-titulo text-xl font-semibold">
            <Link to={`/producto/${salaId}/${producto.id}`} className="text-verde underline">
              {producto.nombre}
            </Link>
          </h2>
          <p className="font-texto text-sm text-tinta/70">
            {producto.categoria} · SKU {producto.sku} · Pasillo {producto.pasillo}
          </p>
        </div>
        <p className="font-ui font-semibold text-tinta">{formatoPrecio(producto.precio)}</p>
      </div>
      {compra ? (
        <div className="mt-4">
          <p className="font-ui text-sm font-semibold text-tinta">
            Stock: {producto.stock} {producto.stock === 1 ? "unidad" : "unidades"}
          </p>
          <div className="mt-3">
            <BotonAgregar completo salaId={salaId} productoId={producto.id} stock={producto.stock} />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <BarraStock stock={producto.stock} objetivo={producto.stockObjetivo} />
          </div>
          <ControlStock producto={producto} salaId={salaId} puedeEditar={puedeEditar} />
        </div>
      )}
    </article>
  );
}
