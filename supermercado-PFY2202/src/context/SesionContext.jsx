import { createContext, useContext, useEffect, useState } from "react";
import { CLIENTE_DEMO, clientePorId } from "../data/clientes.js";
import { CUENTAS, buscarCuenta, cuentaPorId } from "../data/salas.js";
import { guardarLocal, quitarLocal } from "../utils/almacen.js";
import { validarRegistro } from "../utils/validaciones.js";

const CLAVE = "pfy2202-sesion";
const CLAVE_CLIENTES = "pfy2202-clientes";
const SesionContext = createContext(null);

function leerClientes() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CLIENTES) ?? "[]");
    const guardados = Array.isArray(datos)
      ? datos.filter((cliente) => cliente?.id && cliente.usuario && cliente.clave && cliente.nombre)
      : [];
    const porUsuario = new Map(
      guardados.map((cliente) => [cliente.usuario, { ...cliente, tipo: "cliente" }])
    );
    if (!porUsuario.has(CLIENTE_DEMO.usuario)) {
      porUsuario.set(CLIENTE_DEMO.usuario, CLIENTE_DEMO);
    }
    return [...porUsuario.values()];
  } catch {
    return [CLIENTE_DEMO];
  }
}

function leerSesion(clientes) {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
    if (!guardada?.id) return null;
    if (guardada.tipo === "cliente") {
      const cliente = clientePorId(clientes, guardada.id);
      if (!cliente) return null;
      return { id: cliente.id, nombre: cliente.nombre, tipo: "cliente" };
    }
    const cuenta = cuentaPorId(guardada.id);
    if (!cuenta) return null;
    return { id: cuenta.id, nombre: cuenta.nombre, tipo: cuenta.tipo };
  } catch {
    return null;
  }
}

export function SesionProvider({ children }) {
  const [clientes, setClientes] = useState(leerClientes);
  const [sesion, setSesion] = useState(() => leerSesion(clientes));

  useEffect(() => {
    guardarLocal(CLAVE_CLIENTES, clientes);
  }, [clientes]);

  useEffect(() => {
    if (sesion) {
      guardarLocal(CLAVE, sesion);
    } else {
      quitarLocal(CLAVE);
    }
  }, [sesion]);

  function ingresarCliente(usuario, clave) {
    const normalizado = usuario.trim().toLowerCase();
    const cliente = clientes.find((item) => item.usuario === normalizado && item.clave === clave);
    if (!cliente) return false;
    setSesion({ id: cliente.id, nombre: cliente.nombre, tipo: "cliente" });
    return true;
  }

  function ingresarEmpresa(usuario, clave) {
    const cuenta = buscarCuenta(usuario, clave);
    if (!cuenta) return false;
    setSesion({ id: cuenta.id, nombre: cuenta.nombre, tipo: cuenta.tipo });
    return true;
  }

  function registrarCliente({ nombre, usuario, clave }) {
    const errores = validarRegistro({ nombre, usuario, clave });
    const usuarioLimpio = usuario.trim().toLowerCase();
    if (
      !errores.usuario &&
      (CUENTAS.some((cuenta) => cuenta.usuario === usuarioLimpio) ||
        clientes.some((cliente) => cliente.usuario === usuarioLimpio))
    ) {
      errores.usuario = "Ese usuario ya existe.";
    }
    if (Object.keys(errores).length > 0) return { ok: false, errores };

    const nuevo = {
      id: `cliente-${usuarioLimpio}`,
      tipo: "cliente",
      nombre: nombre.trim(),
      usuario: usuarioLimpio,
      clave,
    };
    setClientes((actuales) => [...actuales, nuevo]);
    setSesion({ id: nuevo.id, nombre: nuevo.nombre, tipo: "cliente" });
    return { ok: true, errores: {} };
  }

  function cerrarSesion() {
    setSesion(null);
  }

  return (
    <SesionContext.Provider
      value={{ sesion, clientes, ingresarCliente, ingresarEmpresa, registrarCliente, cerrarSesion }}
    >
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
