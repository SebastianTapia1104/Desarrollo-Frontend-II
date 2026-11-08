import { useState } from "react";
import Boton from "../Boton.jsx";
import { validarConsulta } from "../../utils/validaciones.js";

const INICIAL = { para: "", asunto: "", mensaje: "" };

export default function FormularioConsulta({ destinos, onEnviar }) {
  const [formulario, setFormulario] = useState(INICIAL);
  const [errores, setErrores] = useState({});

  function actualizar(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevos = validarConsulta(formulario);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    const ok = onEnviar(formulario);
    if (!ok) {
      setErrores({ mensaje: "No se pudo registrar la consulta." });
      return;
    }
    setFormulario(INICIAL);
  }

  return (
    <form className="rounded-2xl border border-caqui bg-papel p-4" onSubmit={enviar} noValidate>
      <Campo id="consulta-para" etiqueta="Para" error={errores.para}>
        <select id="consulta-para" name="para" value={formulario.para} onChange={actualizar} aria-invalid={Boolean(errores.para)} className="rounded-lg border border-caqui bg-crema px-3 py-2">
          <option value="">Elige un destino</option>
          {destinos.map((destino) => (
            <option key={destino.id} value={destino.id}>
              {destino.tipo === "sala" ? `Sala ${destino.nombre}` : destino.nombre}
            </option>
          ))}
        </select>
      </Campo>
      <Campo id="consulta-asunto" etiqueta="Asunto" error={errores.asunto}>
        <input id="consulta-asunto" name="asunto" value={formulario.asunto} onChange={actualizar} aria-invalid={Boolean(errores.asunto)} className="rounded-lg border border-caqui bg-crema px-3 py-2" />
      </Campo>
      <Campo id="consulta-mensaje" etiqueta="Mensaje" error={errores.mensaje}>
        <textarea id="consulta-mensaje" name="mensaje" rows="4" maxLength="500" value={formulario.mensaje} onChange={actualizar} aria-invalid={Boolean(errores.mensaje)} className="rounded-lg border border-caqui bg-crema px-3 py-2" />
      </Campo>
      <Boton type="submit" className="mt-4">Enviar consulta</Boton>
    </form>
  );
}

function Campo({ id, etiqueta, error, children }) {
  return (
    <div className="mt-3 grid gap-1">
      <label htmlFor={id} className="font-ui text-sm font-bold">{etiqueta}</label>
      {children}
      {error ? <p className="text-sm text-[#7d3428]" role="alert">{error}</p> : null}
    </div>
  );
}
