import { SALAS } from "../../data/salas.js";

export default function ResumenInventario({ sala, fecha, salaActiva, onElegirSala, productos, unidades, alertas, categorias }) {
  return (
    <section className="grid gap-4 lg:grid-cols-4" aria-label="Resumen de la sala">
      <div className="rounded-2xl bg-verde p-5 text-papel lg:col-span-2 lg:row-span-2">
        <p className="font-ui text-sm font-semibold text-caqui">
          Sala {sala.nombre} · {fecha}
        </p>
        <h1 className="mt-2 font-titulo text-4xl font-semibold">Inventario de sala</h1>
        <p className="mt-3 font-texto text-lg leading-relaxed">
          Elige una sala para revisar su stock. Para reponer o descontar unidades tienes que iniciar sesión con las credenciales de esa sala.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Salas">
          {SALAS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === salaActiva}
              className={`rounded-full px-4 py-2 font-ui text-sm font-semibold ${
                item.id === salaActiva ? "bg-caqui text-verde-oscuro" : "bg-verde-oscuro text-papel"
              }`}
              onClick={() => onElegirSala(item.id)}
            >
              {item.nombre}
            </button>
          ))}
        </div>
      </div>
      <Dato numero={productos} texto="Productos" />
      <Dato numero={unidades} texto="Unidades en sala" />
      <Dato numero={alertas} texto="Alertas de stock" />
      <Dato numero={categorias} texto="Categorías" />
    </section>
  );
}

function Dato({ numero, texto }) {
  return (
    <p className="rounded-2xl bg-papel p-4 text-tinta">
      <strong className="block font-titulo text-4xl font-semibold">{numero}</strong>
      <span className="font-texto text-lg capitalize">{texto}</span>
    </p>
  );
}
