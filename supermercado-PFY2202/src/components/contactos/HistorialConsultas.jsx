import { Link } from "react-router";
import { estaCerrada } from "../../context/ConsultasContext.jsx";
import { etiquetaCuenta, esCuentaEmpresa } from "../../data/salas.js";
import { clientePorId } from "../../data/clientes.js";
import { formatoFecha } from "../../utils/formato.js";

export default function HistorialConsultas({ consultas, clientes }) {
  if (consultas.length === 0) {
    return <p className="rounded-2xl border border-caqui bg-papel p-4 font-texto">Todavía no hay consultas de este acceso.</p>;
  }

  return (
    <ul className="grid list-none gap-3">
      {consultas.map((consulta) => {
        const cerrada = estaCerrada(consulta);
        const ultimo = consulta.mensajes[consulta.mensajes.length - 1];
        return (
          <li key={consulta.id}>
            <Link to={`/contactos/${consulta.id}`} className="block rounded-2xl border border-caqui bg-papel p-4 text-tinta no-underline">
              <span className={`font-ui text-xs font-bold ${cerrada ? "text-verde" : "text-[#7a4e12]"}`}>
                {cerrada ? "Resuelta" : "Pendiente"}
              </span>
              <strong className="mt-1 block font-titulo text-lg">{consulta.asunto}</strong>
              <span className="mt-1 block font-texto text-sm">
                {nombre(consulta.de, clientes)} → {nombre(consulta.para, clientes)}
              </span>
              <span className="mt-2 block font-texto text-sm text-tinta/70">{ultimo?.texto}</span>
              <span className="mt-1 block font-ui text-xs">{ultimo ? formatoFecha(ultimo.fecha) : ""}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function nombre(id, clientes) {
  if (esCuentaEmpresa(id)) return etiquetaCuenta(id);
  return clientePorId(clientes, id)?.nombre ?? "Cliente";
}
