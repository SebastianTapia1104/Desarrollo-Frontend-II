export default function FiltrosInventario({
  busqueda,
  onBusqueda,
  categorias,
  categoria,
  onCategoria,
  soloAlertas,
  onSoloAlertas,
  mostrarAlertas = true,
  mostrarBusqueda = true,
}) {
  return (
    <section className="mt-4 rounded-2xl bg-papel p-4" aria-label="Filtros del inventario">
      {mostrarBusqueda ? (
        <label className="block">
          <span className="sr-only">Buscar producto</span>
          <input
            type="search"
            value={busqueda}
            onChange={(evento) => onBusqueda(evento.target.value)}
            placeholder="Buscar por nombre o SKU"
            className="w-full rounded-lg border border-caqui bg-crema px-3 py-2 font-texto text-tinta"
          />
        </label>
      ) : null}
      <div className={`grid grid-cols-2 gap-2 sm:grid-cols-4 ${mostrarBusqueda ? "mt-3" : ""}`} role="group" aria-label="Categorías">
        {categorias.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === categoria}
            className={`rounded-lg px-2 py-2 text-center font-ui text-sm font-semibold ${
              item === categoria ? "bg-verde text-papel" : "bg-crema text-tinta"
            }`}
            onClick={() => onCategoria(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {mostrarAlertas ? (
        <label className="mt-3 flex items-center gap-2 font-ui text-sm font-semibold">
          <input type="checkbox" checked={soloAlertas} onChange={(evento) => onSoloAlertas(evento.target.checked)} />
          Solo alertas
        </label>
      ) : null}
    </section>
  );
}
