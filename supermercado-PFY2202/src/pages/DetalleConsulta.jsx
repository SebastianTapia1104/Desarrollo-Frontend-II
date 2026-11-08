import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { esParticipante, estaCerrada, useConsultas } from "../context/ConsultasContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { clientePorId } from "../data/clientes.js";
import { esCuentaEmpresa, esHiloConCliente, etiquetaCuenta } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";
import { formatoFecha } from "../utils/formato.js";
import { validarRespuesta } from "../utils/validaciones.js";

export default function DetalleConsulta() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { sesion, clientes } = useSesion();
  const { consultas, responder, marcarResuelta } = useConsultas();
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const consulta = consultas.find((item) => item.id === id) ?? null;
  const participa = Boolean(
    consulta &&
      sesion &&
      esParticipante(consulta, sesion.id) &&
      !(sesion.tipo === "administracion" && esHiloConCliente(consulta))
  );
  const cerrada = consulta ? estaCerrada(consulta) : false;

  useTitulo(consulta ? consulta.asunto : "Consulta");

  useEffect(() => {
    if (!sesion) {
      navigate("/ingresar", { replace: true, state: { desde: location.pathname } });
      return;
    }
    if (!consulta || !participa) {
      navigate("/contactos", {
        replace: true,
        state: { aviso: "Esa consulta no está en tu historial." },
      });
    }
  }, [sesion, consulta, participa, navigate, location.pathname]);

  if (!consulta || !sesion || !participa) return null;

  const otraParte = consulta.de === sesion.id ? consulta.para : consulta.de;

  function enviarRespuesta(evento) {
    evento.preventDefault();
    const errorRespuesta = validarRespuesta(respuesta);
    if (errorRespuesta) {
      setError(errorRespuesta);
      return;
    }
    const ok = responder(consulta.id, respuesta);
    if (!ok) {
      setError("Esta consulta ya está cerrada.");
      return;
    }
    setRespuesta("");
    setError("");
  }

  return (
    <article className="pagina">
      <Link to="/contactos" className="boton boton--secundario volver">
        Volver a contactos
      </Link>
      <nav className="miga" aria-label="Miga de pan">
        <Link to="/contactos">Contactos</Link>
        <span aria-hidden="true">/</span>
        <span>{id}</span>
      </nav>

      <div className="celda celda--hero celda--banda">
        <p className="eyebrow">
          {nombreParticipante(consulta.de, clientes)} → {nombreParticipante(consulta.para, clientes)}
        </p>
        <div className="titulo-estado">
          <h1>{consulta.asunto}</h1>
          <span className={cerrada ? "pill pill--resuelta" : "pill pill--pendiente"}>
            {cerrada ? "Resuelta" : "Pendiente"}
          </span>
        </div>
        <p className="lead">
          {cerrada
            ? "La consulta quedó cerrada porque las dos partes la marcaron como resuelta."
          : "Sigue pendiente hasta que quien escribió y quien recibió la marquen como resuelta."}
        </p>
      </div>

      <ul className="partes bento bento--partes">
        {[consulta.de, consulta.para].map((parte) => {
          const lista = Boolean(consulta.resueltaPor[parte]);
          const soyYo = parte === sesion.id;
          return (
            <li key={parte}>
              <strong>{soyYo ? "Tú" : nombreParticipante(parte, clientes)}</strong>
              <span className={lista ? "pill pill--resuelta" : "pill pill--pendiente"}>
                {lista ? "Resuelta" : "Pendiente"}
              </span>
              {soyYo && !lista ? (
                <button type="button" className="boton" onClick={() => marcarResuelta(consulta.id)}>
                  Marcar como resuelta
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

      <ol className="hilo bento bento--guia">
        {consulta.mensajes.map((mensaje) => (
          <li key={mensaje.id} className={mensaje.autor === sesion.id ? "hilo__item hilo__item--mio" : "hilo__item"}>
            <p className="hilo__autor">
              {mensaje.autor === sesion.id ? "Tú" : nombreParticipante(mensaje.autor, clientes)}
              <span>{formatoFecha(mensaje.fecha)}</span>
            </p>
            <p>{mensaje.texto}</p>
          </li>
        ))}
      </ol>

      {cerrada ? (
        <p className="vacio">La consulta está cerrada y ya no recibe respuestas.</p>
      ) : (
        <form className="formulario" onSubmit={enviarRespuesta}>
          <div className="campo">
            <label htmlFor="respuesta-consulta">Responder a {nombreParticipante(otraParte, clientes)}</label>
            <textarea
              id="respuesta-consulta"
              rows="4"
              maxLength="500"
              value={respuesta}
              onChange={(evento) => setRespuesta(evento.target.value)}
              aria-invalid={Boolean(error)}
            />
            {error ? (
              <p className="campo-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <button type="submit" className="boton">
            Enviar respuesta
          </button>
        </form>
      )}

      <Link to="/contactos" className="boton boton--secundario volver volver--final">
        Volver a contactos
      </Link>
    </article>
  );
}

function nombreParticipante(id, clientes) {
  if (esCuentaEmpresa(id)) return etiquetaCuenta(id);
  return clientePorId(clientes, id)?.nombre ?? "Cliente";
}
