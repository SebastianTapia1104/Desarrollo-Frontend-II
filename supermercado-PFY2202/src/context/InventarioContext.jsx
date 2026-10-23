import { createContext, useContext, useEffect, useState } from "react";
import { PRODUCTOS_INICIALES } from "../data/productos.js";
import { SALAS } from "../data/salas.js";
import { useSesion } from "./SesionContext.jsx";

const CLAVE = "pfy2202-inventario";
const InventarioContext = createContext(null);

function stockInicial(base) {
  return {
    "san-bernardo": base,
    "la-pintana": base === 0 ? 6 : Math.max(0, Math.round(base * 0.35)),
    "puente-alto": Math.min(999, base + 12),
  };
}

function semilla() {
  return PRODUCTOS_INICIALES.map((producto) => ({
    ...producto,
    stockPorSala: stockInicial(producto.stock),
  }));
}

function leerInventario() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
    const valido =
      Array.isArray(datos) &&
      datos.every(
        (producto) =>
          producto.stockPorSala &&
          SALAS.every((sala) => typeof producto.stockPorSala[sala.id] === "number")
      );
    if (!valido) return semilla();
    return PRODUCTOS_INICIALES.map((producto) => {
      const guardado = datos.find((item) => item.id === producto.id);
      return {
        ...producto,
        stockPorSala: guardado?.stockPorSala ?? stockInicial(producto.stock),
      };
    });
  } catch {
    return semilla();
  }
}

export function InventarioProvider({ children }) {
  const { sesion } = useSesion();
  const [productos, setProductos] = useState(leerInventario);

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(productos));
  }, [productos]);

  function ajustarStock(salaId, productoId, delta) {
    if (!sesion || sesion.tipo !== "sala" || sesion.id !== salaId) return;

    setProductos((actuales) =>
      actuales.map((producto) => {
        if (producto.id !== productoId) return producto;
        const actual = producto.stockPorSala[salaId] ?? 0;
        const stock = Math.min(999, Math.max(0, actual + delta));
        return {
          ...producto,
          stockPorSala: { ...producto.stockPorSala, [salaId]: stock },
        };
      })
    );
  }

  return (
    <InventarioContext.Provider value={{ productos, ajustarStock }}>
      {children}
    </InventarioContext.Provider>
  );
}

export function useInventario() {
  const contexto = useContext(InventarioContext);
  if (!contexto) {
    throw new Error("useInventario debe usarse dentro de InventarioProvider");
  }
  return contexto;
}
