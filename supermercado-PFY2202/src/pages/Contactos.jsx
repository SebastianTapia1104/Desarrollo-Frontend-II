import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Aviso from "../components/Aviso.jsx";
import FormularioConsulta from "../components/contactos/FormularioConsulta.jsx";
import HistorialConsultas from "../components/contactos/HistorialConsultas.jsx";
import TarjetaSede from "../components/contactos/TarjetaSede.jsx";
import { useConsultas } from "../context/ConsultasContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { ADMINISTRACION, SALAS, destinosDe, esHiloConCliente, etiquetaCuenta } from "../data/salas.js";
import useAviso from "../hooks/useAviso.js";
import useTitulo from "../hooks/useTitulo.js";

export default function Contactos() {
  useTitulo("Contactos");
  const { sesion, clientes } = useSesion();
  const { consultas, crearConsulta } = useConsultas();
  const navigate = useNavigate();
  const { texto, cerrar } = useAviso();
  const [creada, setCreada] = useState(null);
  const destinos = sesion ? destinosDe(sesion) : [];
  const mias = sesion
    ? consultas
        .filter((consulta) => consulta.de === sesion.id || consulta.para === sesion.id)
        .filter((consulta) => sesion.tipo !== "administracion" || !esHiloConCliente(consulta))
        .slice()
        .sort((a, b) => fechaUltimo(b) - fechaUltimo(a))
    : [];

  useEffect(() => {
    if (creada) navigate(`/contactos/${creada}`);
  }, [creada, navigate]);

  function enviar(formulario) {
    const id = crearConsulta(formulario);
    if (!id) return false;
    setCreada(id);
    return true;
  }

  const ayuda = !sesion
    ? "Inicia sesión como cliente para escribir a una sala, o entra por administración si trabajas en la empresa."
    : sesion.tipo === "cliente"
      ? `Estás en ${sesion.nombre}. Puedes escribir solo a una sala.`
      : sesion.tipo === "administracion"
        ? "Administración solo escribe a las salas. Los mensajes de clientes los responde la sala que los recibió."
        : `Estás en ${etiquetaCuenta(sesion.id)}. Puedes escribir a otra sala o a administración. A un cliente le respondes cuando él escribió primero.`;

  return (
    <article>
      <Aviso onCerrar={cerrar}>{texto}</Aviso>
      <section className="rounded-2xl bg-verde p-5 text-papel">
        <p className="font-ui text-sm font-semibold text-caqui">Contacto para externos</p>
        <h1 className="mt-2 font-titulo text-4xl font-semibold">Contactos</h1>
        <p className="mt-3 max-w-2xl font-texto text-lg">
          Los datos de las sedes están disponibles para cualquier persona. Los mensajes quedan en este navegador.
        </p>
      </section>
      <ul className="mt-4 grid list-none gap-3 md:grid-cols-2">
        {SALAS.map((sala) => (
          <li key={sala.id}>
            <TarjetaSede nombre={`Sala ${sala.nombre}`} lineas={[sala.direccion, sala.horario, sala.domingo, sala.telefono, sala.correo]} />
          </li>
        ))}
        <li>
          <TarjetaSede
            nombre={ADMINISTRACION.nombre}
            lineas={["Casa matriz, en la sala San Bernardo.", ADMINISTRACION.direccion, ADMINISTRACION.horario, ADMINISTRACION.domingo, ADMINISTRACION.telefono, ADMINISTRACION.correo]}
          />
        </li>
      </ul>
      <section className="mt-8">
        <h2 className="font-titulo text-3xl font-semibold">Mensajes</h2>
        <p className="mt-2 font-texto text-lg">{ayuda}</p>
        {!sesion ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/ingresar" state={{ desde: "/contactos" }} className="font-ui font-semibold text-verde underline">Ingreso de clientes</Link>
            <Link to="/ingresar-empresa" state={{ desde: "/contactos" }} className="font-ui font-semibold text-verde underline">Ingreso de administración</Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <FormularioConsulta destinos={destinos} onEnviar={enviar} />
            <div>
              <h3 className="mb-3 font-ui text-lg font-semibold">Historial</h3>
              <HistorialConsultas consultas={mias} clientes={clientes} />
            </div>
          </div>
        )}
      </section>
    </article>
  );
}

function fechaUltimo(consulta) {
  const ultimo = consulta.mensajes[consulta.mensajes.length - 1];
  return new Date(ultimo?.fecha ?? consulta.creada).getTime();
}
