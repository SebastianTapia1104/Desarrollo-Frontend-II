import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { PRODUCTOS_INICIALES } from "../data/productos.js";
import { SALAS } from "../data/salas.js";
import { guardarLocal } from "../utils/almacen.js";
import { normalizar } from "../utils/formato.js";
import { useSesion } from "./SesionContext.jsx";

const CLAVE = "pfy2202-inventario";
const CLAVE_OMITIDOS = "pfy2202-omitidos";
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

function productoValido(producto) {
  return (
    producto?.id &&
    producto.stockPorSala &&
    SALAS.every((sala) => typeof producto.stockPorSala[sala.id] === "number")
  );
}

function leerOmitidos() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_OMITIDOS) ?? "[]");
    return Array.isArray(datos) ? datos.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function leerInventario() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
    if (!Array.isArray(datos) || !datos.every(productoValido)) return semilla();

    const omitidos = leerOmitidos();
    const presentes = new Map(datos.map((producto) => [producto.id, producto]));
    const catalogo = PRODUCTOS_INICIALES.filter((producto) => !omitidos.includes(producto.id)).map(
      (producto) => {
        const guardado = presentes.get(producto.id);
        if (!guardado) return { ...producto, stockPorSala: stockInicial(producto.stock) };
        return {
          ...producto,
          ...guardado,
          id: producto.id,
          stockPorSala: guardado.stockPorSala,
        };
      }
    );
    const agregados = datos.filter(
      (producto) => !PRODUCTOS_INICIALES.some((base) => base.id === producto.id)
    );
    return [...catalogo, ...agregados];
  } catch {
    return semilla();
  }
}

function inventarioReducer(productos, accion) {
  if (accion.type === "ajustar-stock") {
    return productos.map((producto) => {
      if (producto.id !== accion.productoId) return producto;
      const actual = producto.stockPorSala[accion.salaId] ?? 0;
      const stock = Math.min(999, Math.max(0, actual + accion.delta));
      return {
        ...producto,
        stockPorSala: { ...producto.stockPorSala, [accion.salaId]: stock },
      };
    });
  }

  if (accion.type === "fijar-stock") {
    return productos.map((producto) => {
      if (producto.id !== accion.productoId) return producto;
      return {
        ...producto,
        stockPorSala: { ...producto.stockPorSala, [accion.salaId]: accion.stock },
      };
    });
  }

  if (accion.type === "agregar-articulo") {
    return [...productos, accion.articulo];
  }

  if (accion.type === "actualizar-articulo") {
    return productos.map((producto) => {
      if (producto.id !== accion.id) return producto;
      return {
        ...producto,
        ...accion.cambios,
        stockPorSala: { ...producto.stockPorSala, [accion.salaId]: accion.stock },
      };
    });
  }

  if (accion.type === "eliminar-articulo") {
    return productos.filter((producto) => producto.id !== accion.id);
  }

  return productos;
}

function idArticulo(nombre) {
  const base = normalizar(nombre)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "articulo"}-${Date.now()}`;
}

function datosArticulo({ nombre, marca, tipo, precio, stock, pasillo }) {
  const nombreLimpio = nombre.trim();
  const marcaLimpia = marca.trim();
  const tipoLimpio = tipo.trim();
  const precioNumero = Number(precio);
  const stockNumero = Number(stock);
  const pasilloLimpio = pasillo.trim();

  if (nombreLimpio.length < 2 || marcaLimpia.length < 2 || tipoLimpio.length < 2) return null;
  if (!Number.isFinite(precioNumero) || precioNumero < 0) return null;
  if (!Number.isInteger(stockNumero) || stockNumero < 0 || stockNumero > 999) return null;

  return {
    nombre: nombreLimpio,
    marca: marcaLimpia,
    tipo: tipoLimpio,
    categoria: tipoLimpio,
    precio: Math.round(precioNumero),
    pasillo: pasilloLimpio || "1",
    stock: stockNumero,
    descripcion: `${nombreLimpio}, de ${marcaLimpia}. Entra al inventario como ${tipoLimpio}.`,
  };
}

function stockPorTienda(salaId, stockNumero) {
  return Object.fromEntries(SALAS.map((sala) => [sala.id, sala.id === salaId ? stockNumero : 0]));
}

export function InventarioProvider({ children }) {
  const { sesion } = useSesion();
  const [productos, dispatch] = useReducer(inventarioReducer, null, leerInventario);
  const [omitidos, setOmitidos] = useState(leerOmitidos);

  useEffect(() => {
    guardarLocal(CLAVE, productos);
  }, [productos]);

  useEffect(() => {
    guardarLocal(CLAVE_OMITIDOS, omitidos);
  }, [omitidos]);

  function salaActiva() {
    if (!sesion || sesion.tipo !== "sala") return null;
    return sesion.id;
  }

  function ajustarStock(salaId, productoId, delta) {
    if (salaActiva() !== salaId) return;
    dispatch({ type: "ajustar-stock", salaId, productoId, delta });
  }

  function fijarStock(salaId, productoId, cantidad) {
    if (salaActiva() !== salaId) return;
    const stock = Math.min(999, Math.max(0, Number(cantidad)));
    if (!Number.isInteger(stock)) return;
    dispatch({ type: "fijar-stock", salaId, productoId, stock });
  }

  function agregarArticulo(datos) {
    const salaId = salaActiva();
    const limpio = datosArticulo(datos);
    if (!salaId || !limpio) return null;

    const articulo = {
      id: idArticulo(limpio.nombre),
      nombre: limpio.nombre,
      marca: limpio.marca,
      tipo: limpio.tipo,
      categoria: limpio.categoria,
      sku: `PFY-${String(Date.now()).slice(-6)}`,
      precio: limpio.precio,
      stock: limpio.stock,
      stockObjetivo: Math.max(limpio.stock, 10),
      pasillo: limpio.pasillo,
      unidad: "un",
      descripcion: limpio.descripcion,
      stockPorSala: stockPorTienda(salaId, limpio.stock),
    };

    dispatch({ type: "agregar-articulo", articulo });
    return articulo.id;
  }

  function actualizarArticulo(id, datos) {
    const salaId = salaActiva();
    const limpio = datosArticulo(datos);
    if (!salaId || !limpio || !productos.some((producto) => producto.id === id)) return null;

    dispatch({
      type: "actualizar-articulo",
      id,
      salaId,
      stock: limpio.stock,
      cambios: {
        nombre: limpio.nombre,
        marca: limpio.marca,
        tipo: limpio.tipo,
        categoria: limpio.categoria,
        precio: limpio.precio,
        pasillo: limpio.pasillo,
        descripcion: limpio.descripcion,
      },
    });
    return id;
  }

  function eliminarArticulo(id) {
    if (!salaActiva() || !productos.some((producto) => producto.id === id)) return false;
    dispatch({ type: "eliminar-articulo", id });
    if (PRODUCTOS_INICIALES.some((producto) => producto.id === id)) {
      setOmitidos((actual) => (actual.includes(id) ? actual : [...actual, id]));
    }
    return true;
  }

  return (
    <InventarioContext.Provider
      value={{ productos, ajustarStock, fijarStock, agregarArticulo, actualizarArticulo, eliminarArticulo }}
    >
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
