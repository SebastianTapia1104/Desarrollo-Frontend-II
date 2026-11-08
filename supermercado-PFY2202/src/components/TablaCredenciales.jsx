export default function TablaCredenciales({ cuentas, titulo, descripcion, className = "" }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-caqui bg-papel ${className || "mt-6"}`}>
      <div className="px-4 pt-4">
        <h2 className="font-titulo text-2xl font-semibold text-tinta">{titulo}</h2>
        {descripcion ? <p className="mt-2 font-texto text-base text-tinta/80">{descripcion}</p> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="mt-3 w-full min-w-[28rem] border-collapse text-left">
          <caption className="sr-only">{titulo}</caption>
          <thead className="bg-verde font-ui text-sm text-papel">
            <tr>
              <th className="px-4 py-3 font-semibold">Acceso</th>
              <th className="px-4 py-3 font-semibold">Usuario</th>
              <th className="px-4 py-3 font-semibold">Clave</th>
            </tr>
          </thead>
          <tbody className="font-texto text-base text-tinta">
            {cuentas.map((cuenta) => (
              <tr key={cuenta.id} className="border-t border-caqui/70">
                <td className="px-4 py-3">{etiqueta(cuenta)}</td>
                <td className="px-4 py-3">
                  <code>{cuenta.usuario}</code>
                </td>
                <td className="px-4 py-3">
                  <code>{cuenta.clave}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function etiqueta(cuenta) {
  if (cuenta.tipo === "sala") return `Sala ${cuenta.nombre}`;
  if (cuenta.tipo === "cliente") return cuenta.nombre;
  return cuenta.nombre;
}
