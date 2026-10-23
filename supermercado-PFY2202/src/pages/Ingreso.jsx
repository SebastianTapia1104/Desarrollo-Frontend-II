import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";
import { CUENTAS } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";

export default function Ingreso() {
  useTitulo("Ingresar");
  const { sesion, ingresar } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.desde && location.state.desde !== "/ingresar" ? location.state.desde : "/";
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (sesion || listo) {
      navigate(destino, { replace: true });
    }
  }, [sesion, listo, destino, navigate]);

  function enviar(evento) {
    evento.preventDefault();
    const ok = ingresar(usuario, clave);
    if (!ok) {
      setError("Usuario o clave incorrectos.");
      return;
    }
    setError("");
    setListo(true);
  }

  return (
    <article className="pagina">
      <div className="bento bento--ingreso">
      <div className="celda celda--hero">
        <p className="eyebrow">Acceso de sala</p>
        <h1>Ingresar</h1>
        <p className="lead">
          Cada sala entra con su propio usuario. Administración también tiene acceso, para
          responder las consultas que le envían las salas.
        </p>
      </div>

      <form className="formulario celda" onSubmit={enviar} noValidate>
        <div className="campo">
          <label htmlFor="ingreso-usuario">Usuario</label>
          <input
            id="ingreso-usuario"
            name="usuario"
            value={usuario}
            onChange={(evento) => setUsuario(evento.target.value)}
            autoComplete="username"
            aria-invalid={Boolean(error)}
          />
        </div>
        <div className="campo">
          <label htmlFor="ingreso-clave">Clave</label>
          <input
            id="ingreso-clave"
            name="clave"
            type="password"
            value={clave}
            onChange={(evento) => setClave(evento.target.value)}
            autoComplete="current-password"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "ingreso-error" : undefined}
          />
          {error ? (
            <p id="ingreso-error" className="campo-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <button type="submit" className="boton">
          Entrar
        </button>
      </form>
      </div>

      <section className="celda tabla-accesos">
        <h2>Accesos de demostración</h2>
        <TablaAccesos />
      </section>
    </article>
  );
}

function TablaAccesos() {
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <caption className="sr-only">Credenciales de demostración</caption>
        <thead>
          <tr>
            <th>Acceso</th>
            <th>Usuario</th>
            <th>Clave</th>
          </tr>
        </thead>
        <tbody>
          {CUENTAS.map((cuenta) => (
            <tr key={cuenta.id}>
              <td>{cuenta.tipo === "sala" ? `Sala ${cuenta.nombre}` : cuenta.nombre}</td>
              <td>
                <code>{cuenta.usuario}</code>
              </td>
              <td>
                <code>{cuenta.clave}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
