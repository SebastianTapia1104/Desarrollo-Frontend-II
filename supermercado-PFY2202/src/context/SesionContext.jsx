import { createContext, useContext, useEffect, useState } from "react";
import { buscarCuenta, cuentaPorId } from "../data/salas.js";

const CLAVE = "pfy2202-sesion";
const SesionContext = createContext(null);

function leerSesion() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
    if (!guardada?.id || !cuentaPorId(guardada.id)) return null;
    const cuenta = cuentaPorId(guardada.id);
    return { id: cuenta.id, nombre: cuenta.nombre, tipo: cuenta.tipo };
  } catch {
    return null;
  }
}

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  useEffect(() => {
    if (sesion) {
      localStorage.setItem(CLAVE, JSON.stringify(sesion));
    } else {
      localStorage.removeItem(CLAVE);
    }
  }, [sesion]);

  function ingresar(usuario, clave) {
    const cuenta = buscarCuenta(usuario, clave);
    if (!cuenta) return false;
    setSesion({ id: cuenta.id, nombre: cuenta.nombre, tipo: cuenta.tipo });
    return true;
  }

  function cerrarSesion() {
    setSesion(null);
  }

  return (
    <SesionContext.Provider value={{ sesion, ingresar, cerrarSesion }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de SesionProvider");
  }
  return contexto;
}
