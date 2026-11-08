import { createContext, useContext, useEffect, useState } from "react";
import { guardarLocal } from "../utils/almacen.js";
import { useInventario } from "./InventarioContext.jsx";
import { useSesion } from "./SesionContext.jsx";

const CLAVE = "pfy2202-carrito";
const CLAVE_DEVUELTO = "pfy2202-carrito-devuelto";
const CarritoContext = createContext(null);

function lineaValida(linea) {
  return linea && typeof linea.productoId === "string" && Number.isInteger(linea.cantidad) && linea.cantidad > 0;
}

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
    if (datos?.version === 2 && datos.bolsas && typeof datos.bolsas === "object") {
      return {
        version: 2,
        bolsas: limpiarBolsas(datos.bolsas),
        devolver: Array.isArray(datos.devolver) ? datos.devolver : [],
      };
    }
    return convertirAnterior(datos);
  } catch {
    return { version: 2, bolsas: {}, devolver: [] };
  }
}

function limpiarBolsas(bolsas) {
  return Object.fromEntries(
    Object.entries(bolsas)
      .map(([clienteId, bolsa]) => [
        clienteId,
        {
          salaId: typeof bolsa?.salaId === "string" ? bolsa.salaId : "",
          lineas: Array.isArray(bolsa?.lineas) ? bolsa.lineas.filter(lineaValida) : [],
        },
      ])
      .filter(([, bolsa]) => bolsa.salaId)
  );
}

function convertirAnterior(datos) {
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return { version: 2, bolsas: {}, devolver: [] };
  }
  const bolsas = {};
  const devolver = [];
  Object.entries(datos).forEach(([clienteId, porSala]) => {
    if (!porSala || typeof porSala !== "object" || Array.isArray(porSala)) return;
    const salas = Object.entries(porSala).filter(([, lineas]) => Array.isArray(lineas));
    const conArticulos = salas.filter(([, lineas]) => lineas.some(lineaValida));
    const [primera, ...resto] = conArticulos;
    if (primera) {
      bolsas[clienteId] = {
        salaId: primera[0],
        lineas: primera[1].filter(lineaValida),
      };
    }
    resto.forEach(([salaId, lineas]) => {
      lineas.filter(lineaValida).forEach((linea) => {
        devolver.push({ salaId, productoId: linea.productoId, cantidad: linea.cantidad });
      });
    });
  });
  return { version: 2, bolsas, devolver };
}

export function CarritoProvider({ children }) {
  const { sesion } = useSesion();
  const { productos, moverStock } = useInventario();
  const [carritos, setCarritos] = useState(leerCarrito);
  const [abierto, setAbierto] = useState(false);
  const clienteId = sesion?.tipo === "cliente" ? sesion.id : null;
  const bolsa = clienteId ? carritos.bolsas[clienteId] : null;
  const salaId = bolsa?.salaId ?? "";
  const lineas = (bolsa?.lineas ?? []).map((linea) => ({ ...linea, salaId }));

  useEffect(() => {
    guardarLocal(CLAVE, carritos);
  }, [carritos]);

  useEffect(() => {
    const pendientes = carritos.devolver ?? [];
    if (pendientes.length === 0) return;
    const firma = JSON.stringify(pendientes);
    if (localStorage.getItem(CLAVE_DEVUELTO) !== firma) {
      localStorage.setItem(CLAVE_DEVUELTO, firma);
      pendientes.forEach((item) => moverStock(item.salaId, item.productoId, item.cantidad));
    }
    setCarritos((actual) => ({ ...actual, devolver: [] }));
  }, [carritos.devolver, moverStock]);

  function guardarBolsa(siguienteSala, siguientes) {
    setCarritos((actual) => ({
      ...actual,
      bolsas: {
        ...actual.bolsas,
        [clienteId]: { salaId: siguienteSala, lineas: siguientes },
      },
    }));
  }

  function agregar(salaDestino, productoId, cantidad) {
    if (!clienteId) return "Inicia sesión como cliente para comprar.";
    const unidades = Number(cantidad);
    if (!Number.isInteger(unidades) || unidades < 1) {
      return "La cantidad debe ser un entero mayor a 0.";
    }
    const actuales = bolsa?.lineas ?? [];
    if (actuales.length > 0 && salaId && salaId !== salaDestino) {
      return "El carrito está en otra sala. Cámbiala desde el supermercado para mover estos artículos.";
    }
    if (!moverStock(salaDestino, productoId, -unidades)) {
      return "No hay stock suficiente en esta sala.";
    }
    const indice = actuales.findIndex((linea) => linea.productoId === productoId);
    const siguientes = [...actuales];
    if (indice >= 0) {
      siguientes[indice] = { ...siguientes[indice], cantidad: siguientes[indice].cantidad + unidades };
    } else {
      siguientes.push({ productoId, cantidad: unidades });
    }
    guardarBolsa(salaDestino, siguientes);
    setAbierto(true);
    return "";
  }

  function cambiar(productoId, delta) {
    if (!clienteId || !salaId) return "Inicia sesión como cliente para comprar.";
    if (!Number.isInteger(delta) || delta === 0) return "No se pudo actualizar la cantidad.";
    const actuales = bolsa?.lineas ?? [];
    const linea = actuales.find((item) => item.productoId === productoId);
    if (!linea) return "Ese artículo no está en el carrito.";

    if (delta > 0) {
      if (!moverStock(salaId, productoId, -delta)) {
        return "No hay stock suficiente en esta sala.";
      }
      guardarBolsa(
        salaId,
        actuales.map((item) =>
          item.productoId === productoId ? { ...item, cantidad: item.cantidad + delta } : item
        )
      );
      return "";
    }

    const devueltas = Math.min(linea.cantidad, -delta);
    moverStock(salaId, productoId, devueltas);
    const cantidad = linea.cantidad - devueltas;
    guardarBolsa(
      salaId,
      cantidad > 0
        ? actuales.map((item) => (item.productoId === productoId ? { ...item, cantidad } : item))
        : actuales.filter((item) => item.productoId !== productoId)
    );
    return "";
  }

  function quitar(productoId) {
    const actuales = bolsa?.lineas ?? [];
    const linea = actuales.find((item) => item.productoId === productoId);
    if (!clienteId || !salaId || !linea) return;
    moverStock(salaId, productoId, linea.cantidad);
    guardarBolsa(
      salaId,
      actuales.filter((item) => item.productoId !== productoId)
    );
  }

  function trasladar(destinoId) {
    if (!clienteId) return [];
    const actuales = bolsa?.lineas ?? [];
    if (!salaId || salaId === destinoId || actuales.length === 0) {
      guardarBolsa(destinoId, actuales);
      return [];
    }

    const siguientes = [];
    const cambios = [];
    actuales.forEach((linea) => {
      const producto = productos.find((item) => item.id === linea.productoId);
      moverStock(salaId, linea.productoId, linea.cantidad);
      const disponible = producto?.stockPorSala?.[destinoId] ?? 0;
      const tomar = Math.min(linea.cantidad, disponible);
      const quedo = tomar > 0 && moverStock(destinoId, linea.productoId, -tomar) ? tomar : 0;
      if (quedo > 0) {
        siguientes.push({ productoId: linea.productoId, cantidad: quedo });
      }
      if (quedo !== linea.cantidad) {
        cambios.push({ productoId: linea.productoId, antes: linea.cantidad, despues: quedo });
      }
    });
    guardarBolsa(destinoId, siguientes);
    return cambios;
  }

  const unidades = lineas.reduce((total, linea) => total + linea.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        lineas,
        salaId,
        unidades,
        abierto,
        abrir: () => setAbierto(true),
        cerrar: () => setAbierto(false),
        agregar,
        cambiar,
        quitar,
        trasladar,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }
  return contexto;
}
