import { useState } from "react";
import { useSearchParams } from "react-router";
import Aviso from "../components/Aviso.jsx";
import FiltrosInventario from "../components/inventario/FiltrosInventario.jsx";
import TarjetaProducto from "../components/inventario/TarjetaProducto.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useInventario } from "../context/InventarioContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { SALAS } from "../data/salas.js";
import useAviso from "../hooks/useAviso.js";
import useTitulo from "../hooks/useTitulo.js";

export default function Supermercado() {
  useTitulo("Supermercado");
  const { productos } = useInventario();
  const { sesion } = useSesion();
  const { lineas, salaId: salaCarrito, trasladar } = useCarrito();
  const { texto, mostrar, cerrar } = useAviso();
  const [params, setParams] = useSearchParams();
  const [categoria, setCategoria] = useState("Todas");
  const [pendiente, setPendiente] = useState(null);
  const salaActiva = SALAS.find((sala) => sala.id === params.get("sala"))?.id ?? SALAS[0].id;
  const sala = SALAS.find((item) => item.id === salaActiva);
  const inventario = productos.map((producto) => ({
    ...producto,
    stock: producto.stockPorSala[salaActiva] ?? 0,
  }));
  const categorias = ["Todas", ...new Set(inventario.map((producto) => producto.categoria || producto.tipo))];
  const visibles = inventario.filter(
    (producto) => categoria === "Todas" || (producto.categoria || producto.tipo) === categoria
  );
  const salaPendiente = SALAS.find((item) => item.id === pendiente) ?? null;

  function elegirSala(id) {
    if (id === salaActiva) return;
    if (sesion?.tipo === "cliente" && lineas.length > 0 && salaCarrito && salaCarrito !== id) {
      setPendiente(id);
      return;
    }
    setParams({ sala: id });
  }

  function confirmarSala() {
    if (!salaPendiente) return;
    const cambios = trasladar(salaPendiente.id);
    setParams({ sala: salaPendiente.id });
    setPendiente(null);
    mostrar(describirTraslado(cambios, productos, salaPendiente));
  }

  return (
    <article>
      <section className="rounded-2xl bg-verde p-5 text-papel">
        <p className="font-ui text-sm font-semibold text-caqui">Elige dónde comprar</p>
        <h1 className="mt-2 font-titulo text-4xl font-semibold">Supermercado</h1>
        <p className="mt-3 max-w-2xl font-texto text-lg leading-relaxed">
          El stock que ves es el de {sala.nombre}. Añadir un artículo abre el carrito y descuenta esa sala.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Sala de compra">
          {SALAS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === salaActiva}
              className={`rounded-full px-4 py-2 font-ui text-sm font-semibold ${
                item.id === salaActiva ? "bg-caqui text-verde-oscuro" : "bg-verde-oscuro text-papel"
              }`}
              onClick={() => elegirSala(item.id)}
            >
              {item.nombre}
            </button>
          ))}
        </div>
      </section>
      <FiltrosInventario
        categorias={categorias}
        categoria={categoria}
        onCategoria={setCategoria}
        mostrarBusqueda={false}
        mostrarAlertas={false}
      />
      <Aviso onCerrar={cerrar}>{texto}</Aviso>
      <p className="mt-4 font-texto" role="status">
        Mostrando {visibles.length} de {inventario.length} productos en {sala.nombre}
      </p>
      <ul className="mt-4 grid list-none gap-4 md:grid-cols-2">
        {visibles.map((producto) => (
          <li key={producto.id}>
            <TarjetaProducto producto={producto} salaId={salaActiva} compra />
          </li>
        ))}
      </ul>
      {salaPendiente ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-verde-oscuro/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-cambio-sala"
            className="w-full max-w-md rounded-2xl border border-caqui bg-papel p-5"
          >
            <h2 id="titulo-cambio-sala" className="font-titulo text-2xl font-semibold">
              Cambiar a {salaPendiente.nombre}
            </h2>
            <p className="mt-3 font-texto leading-relaxed">
              El carrito tiene artículos de {sala.nombre}. Si en {salaPendiente.nombre} no alcanza el stock, se deja la cantidad máxima. Si no hay stock, el artículo se quita del carrito.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-caqui px-4 font-ui font-semibold text-verde-oscuro"
                onClick={confirmarSala}
              >
                Cambiar de sala
              </button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-caqui px-4 font-ui font-semibold text-verde"
                onClick={() => setPendiente(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function describirTraslado(cambios, productos, sala) {
  if (cambios.length === 0) {
    return `El carrito ahora descuenta el stock de ${sala.nombre}.`;
  }
  const frases = cambios.map((cambio) => {
    const nombre = productos.find((producto) => producto.id === cambio.productoId)?.nombre ?? "Un artículo";
    if (cambio.despues === 0) {
      return `${nombre} se quitó porque ${sala.nombre} no tiene stock.`;
    }
    return `${nombre} pasó de ${cambio.antes} a ${cambio.despues}, el máximo disponible en ${sala.nombre}.`;
  });
  return `El carrito quedó en ${sala.nombre}. ${frases.join(" ")}`;
}
