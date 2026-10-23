import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { esParticipante, estaCerrada, useConsultas } from "../context/ConsultasContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { etiquetaCuenta } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";
import { decodificarSegmento, formatoFecha } from "../utils/formato.js";

export default function DetalleConsulta() {
  const { id: idParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { sesion } = useSesion();
  const { consultas, responder, marcarResuelta } = useConsultas();
  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");

  const segmento = decodificarSegmento(location.pathname.split("/").filter(Boolean)[1] ?? "");
  const id = idParam ?? segmento;
  const consulta = consultas.find((item) => item.id === id) ?? null;
  const participa = Boolean(consulta && sesion && esParticipante(consulta, sesion.id));
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
    if (respuesta.trim().length < 2) {
      setError("Escribe una respuesta de al menos 2 caracteres.");
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
        <span>{segmento}</span>
      </nav>

      <div className="celda celda--hero celda--banda">
        <p className="eyebrow">
          {etiquetaCuenta(consulta.de)} → {etiquetaCuenta(consulta.para)}
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
              <strong>{soyYo ? "Tú" : etiquetaCuenta(parte)}</strong>
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
              {mensaje.autor === sesion.id ? "Tú" : etiquetaCuenta(mensaje.autor)}
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
            <label htmlFor="respuesta-consulta">Responder a {etiquetaCuenta(otraParte)}</label>
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
