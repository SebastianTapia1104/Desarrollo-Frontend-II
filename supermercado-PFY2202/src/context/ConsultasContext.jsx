import { createContext, useContext, useEffect, useState } from "react";
import { CONSULTAS_INICIALES } from "../data/consultasIniciales.js";
import { destinosDe } from "../data/salas.js";
import { useSesion } from "./SesionContext.jsx";

const CLAVE = "pfy2202-consultas";
const ConsultasContext = createContext(null);

export function esParticipante(consulta, cuentaId) {
  return consulta.de === cuentaId || consulta.para === cuentaId;
}

export function estaCerrada(consulta) {
  return Boolean(consulta.resueltaPor[consulta.de] && consulta.resueltaPor[consulta.para]);
}

function leerConsultas() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
    const valida =
      Array.isArray(datos) &&
      datos.every((consulta) => consulta.id && consulta.de && consulta.para && Array.isArray(consulta.mensajes));
    return valida ? datos : CONSULTAS_INICIALES;
  } catch {
    return CONSULTAS_INICIALES;
  }
}

export function ConsultasProvider({ children }) {
  const { sesion } = useSesion();
  const [consultas, setConsultas] = useState(leerConsultas);

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(consultas));
  }, [consultas]);

  function crearConsulta({ para, asunto, mensaje }) {
    if (!sesion) return null;
    const destinoValido = destinosDe(sesion.id).some((destino) => destino.id === para);
    const asuntoLimpio = asunto.trim();
    const texto = mensaje.trim();
    if (!destinoValido || asuntoLimpio.length < 3 || texto.length < 10) return null;

    const ahora = new Date().toISOString();
    const id = `consulta-${Date.now()}`;
    const nueva = {
      id,
      de: sesion.id,
      para,
      asunto: asuntoLimpio,
      creada: ahora,
      mensajes: [{ id: `msg-${Date.now()}`, autor: sesion.id, texto, fecha: ahora }],
      resueltaPor: { [sesion.id]: false, [para]: false },
    };

    setConsultas((actuales) => [nueva, ...actuales]);
    return id;
  }

  function responder(id, texto) {
    const limpio = texto.trim();
    const actual = consultas.find((consulta) => consulta.id === id);
    if (!sesion || !actual || limpio.length < 2) return false;
    if (!esParticipante(actual, sesion.id) || estaCerrada(actual)) return false;

    const nuevo = {
      id: `msg-${Date.now()}`,
      autor: sesion.id,
      texto: limpio,
      fecha: new Date().toISOString(),
    };

    setConsultas((lista) =>
      lista.map((consulta) => {
        if (consulta.id !== id || estaCerrada(consulta)) return consulta;
        if (consulta.mensajes.some((item) => item.id === nuevo.id)) return consulta;
        return { ...consulta, mensajes: [...consulta.mensajes, nuevo] };
      })
    );
    return true;
  }

  function marcarResuelta(id) {
    if (!sesion) return;
    setConsultas((actuales) =>
      actuales.map((consulta) => {
        if (consulta.id !== id || !esParticipante(consulta, sesion.id)) return consulta;
        return {
          ...consulta,
          resueltaPor: { ...consulta.resueltaPor, [sesion.id]: true },
        };
      })
    );
  }

  return (
    <ConsultasContext.Provider value={{ consultas, crearConsulta, responder, marcarResuelta }}>
      {children}
    </ConsultasContext.Provider>
  );
}

export function useConsultas() {
  const contexto = useContext(ConsultasContext);
  if (!contexto) {
    throw new Error("useConsultas debe usarse dentro de ConsultasProvider");
  }
  return contexto;
}
