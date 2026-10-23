import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { estaCerrada, useConsultas } from "../context/ConsultasContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { ADMINISTRACION, SALAS, destinosDe, etiquetaCuenta } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";
import { formatoFecha } from "../utils/formato.js";

const FORMULARIO_INICIAL = { para: "", asunto: "", mensaje: "" };

export default function Contactos() {
  useTitulo("Contactos");
  const { sesion } = useSesion();
  const { consultas, crearConsulta } = useConsultas();
  const navigate = useNavigate();
  const location = useLocation();
  const aviso = location.state?.aviso ?? "";
  const [ocultarAviso, setOcultarAviso] = useState(false);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [creada, setCreada] = useState(null);

  const destinos = sesion ? destinosDe(sesion.id) : [];
  const mias = sesion
    ? consultas
        .filter((consulta) => consulta.de === sesion.id || consulta.para === sesion.id)
        .slice()
        .sort((a, b) => fechaUltimo(b) - fechaUltimo(a))
    : [];

  useEffect(() => {
    if (creada) {
      navigate(`/contactos/${creada}`);
    }
  }, [creada, navigate]);

  function actualizar(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevos = {};
    if (!formulario.para) nuevos.para = "Elige a quién va dirigida.";
    if (formulario.asunto.trim().length < 3) nuevos.asunto = "Escribe un asunto breve.";
    if (formulario.mensaje.trim().length < 10) nuevos.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const id = crearConsulta(formulario);
    if (!id) {
      setErrores({ mensaje: "No se pudo registrar la consulta." });
      return;
    }
    setFormulario(FORMULARIO_INICIAL);
    setCreada(id);
  }

  return (
    <article className="pagina">
      {aviso && !ocultarAviso ? (
        <p className="aviso" role="status">
          <span>{aviso}</span>
          <button type="button" onClick={() => setOcultarAviso(true)}>
            Cerrar
          </button>
        </p>
      ) : null}

      <section className="bloque">
        <div className="bento bento--sedes">
          <div className="celda celda--hero">
            <p className="eyebrow">Contacto para externos</p>
            <h1>Contactos</h1>
            <p className="lead">
              Los datos de las sedes están disponibles para cualquier persona. Los mensajes entre
              salas y con administración quedan en un historial y parten como pendientes.
            </p>
          </div>
          <ul className="sedes">
            {SALAS.map((sala) => (
              <li key={sala.id} className="sede celda">
                <h3>Sala {sala.nombre}</h3>
                <p>{sala.direccion}</p>
                <p>{sala.horario}</p>
                <p>{sala.domingo}</p>
              <p>{sala.telefono}</p>
              <Correo correo={sala.correo} />
              </li>
            ))}
            <li className="sede celda">
              <h3>{ADMINISTRACION.nombre}</h3>
              <p>Casa matriz, en la sala San Bernardo.</p>
              <p>{ADMINISTRACION.direccion}</p>
              <p>{ADMINISTRACION.horario}</p>
              <p>{ADMINISTRACION.domingo}</p>
            <p>{ADMINISTRACION.telefono}</p>
            <Correo correo={ADMINISTRACION.correo} />
            </li>
          </ul>
        </div>
      </section>

      <section className="bloque">
        <h2>Mensajes entre salas</h2>
        {!sesion ? (
          <div className="aviso">
            <span>Inicia sesión con una sala, o con administración, para escribir y ver el historial.</span>
            <Link to="/ingresar" state={{ desde: "/contactos" }}>
              Ingresar
            </Link>
          </div>
        ) : (
          <>
            <p className="lead">
              Estás en {etiquetaCuenta(sesion.id)}. Una consulta nueva queda Pendiente hasta que
              quien la envía y quien la recibe la marquen como Resuelta.
            </p>
            <div className="bento bento--mensajes">
            <form className="formulario celda" onSubmit={enviar} noValidate>
              <div className="campo">
                <label htmlFor="consulta-para">Para</label>
                <select
                  id="consulta-para"
                  name="para"
                  value={formulario.para}
                  onChange={actualizar}
                  aria-invalid={Boolean(errores.para)}
                >
                  <option value="">Elige un destino</option>
                  {destinos.map((destino) => (
                    <option key={destino.id} value={destino.id}>
                      {destino.tipo === "sala" ? `Sala ${destino.nombre}` : destino.nombre}
                    </option>
                  ))}
                </select>
                {errores.para ? (
                  <p className="campo-error" role="alert">
                    {errores.para}
                  </p>
                ) : null}
              </div>
              <div className="campo">
                <label htmlFor="consulta-asunto">Asunto</label>
                <input
                  id="consulta-asunto"
                  name="asunto"
                  value={formulario.asunto}
                  onChange={actualizar}
                  aria-invalid={Boolean(errores.asunto)}
                />
                {errores.asunto ? (
                  <p className="campo-error" role="alert">
                    {errores.asunto}
                  </p>
                ) : null}
              </div>
              <div className="campo">
                <label htmlFor="consulta-mensaje">Mensaje</label>
                <textarea
                  id="consulta-mensaje"
                  name="mensaje"
                  rows="4"
                  maxLength="500"
                  value={formulario.mensaje}
                  onChange={actualizar}
                  aria-invalid={Boolean(errores.mensaje)}
                />
                {errores.mensaje ? (
                  <p className="campo-error" role="alert">
                    {errores.mensaje}
                  </p>
                ) : null}
              </div>
              <button type="submit" className="boton">
                Enviar consulta
              </button>
            </form>

            <div className="celda">
            <h3 className="subtitulo">Historial</h3>
            {mias.length === 0 ? (
              <p className="vacio">Todavía no hay consultas de este acceso.</p>
            ) : (
              <ul className="consultas">
                {mias.map((consulta) => {
                  const cerrada = estaCerrada(consulta);
                  const ultimo = consulta.mensajes[consulta.mensajes.length - 1];
                  return (
                    <li key={consulta.id}>
                      <Link to={`/contactos/${consulta.id}`} className="consulta">
                        <span className={cerrada ? "pill pill--resuelta" : "pill pill--pendiente"}>
                          {cerrada ? "Resuelta" : "Pendiente"}
                        </span>
                        <strong>{consulta.asunto}</strong>
                        <span className="consulta__meta">
                          {etiquetaCuenta(consulta.de)} → {etiquetaCuenta(consulta.para)}
                        </span>
                        <span className="consulta__preview">{ultimo?.texto}</span>
                        <span className="consulta__meta">{ultimo ? formatoFecha(ultimo.fecha) : ""}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            </div>
            </div>
          </>
        )}
      </section>
    </article>
  );
}

function Correo({ correo }) {
  const corte = correo.indexOf("@");
  if (corte === -1) return <p>{correo}</p>;
  return (
    <p>
      {correo.slice(0, corte + 1)}
      <wbr />
      {correo.slice(corte + 1)}
    </p>
  );
}

function fechaUltimo(consulta) {
  const ultimo = consulta.mensajes[consulta.mensajes.length - 1];
  return new Date(ultimo?.fecha ?? consulta.creada).getTime();
}
