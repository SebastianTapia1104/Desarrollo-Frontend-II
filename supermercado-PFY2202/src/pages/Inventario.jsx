import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import Aviso from "../components/Aviso.jsx";
import FiltrosInventario from "../components/inventario/FiltrosInventario.jsx";
import ResumenInventario from "../components/inventario/ResumenInventario.jsx";
import TarjetaProducto from "../components/inventario/TarjetaProducto.jsx";
import { useInventario } from "../context/InventarioContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { SALAS, etiquetaCuenta } from "../data/salas.js";
import useAviso from "../hooks/useAviso.js";
import useTitulo from "../hooks/useTitulo.js";
import { estadoStock, normalizar } from "../utils/formato.js";

export default function Inventario() {
  useTitulo("Inventario de sala");
  const { productos } = useInventario();
  const { sesion } = useSesion();
  const { texto, cerrar } = useAviso();
  const [params, setParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [soloAlertas, setSoloAlertas] = useState(false);

  const salaPedida = params.get("sala");
  const salaActiva =
    SALAS.find((sala) => sala.id === salaPedida)?.id ?? (sesion?.tipo === "sala" ? sesion.id : SALAS[0].id);
  const sala = SALAS.find((item) => item.id === salaActiva);
  const puedeEditar = sesion?.tipo === "sala" && sesion.id === salaActiva;
  const inventario = productos.map((producto) => ({
    ...producto,
    stock: producto.stockPorSala[salaActiva] ?? 0,
  }));
  const categorias = ["Todas", ...new Set(inventario.map((producto) => producto.categoria || producto.tipo))];
  const consulta = normalizar(busqueda.trim());
  const visibles = inventario.filter((producto) => {
    const textoProducto = normalizar(`${producto.nombre} ${producto.sku} ${producto.categoria}`);
    const coincideTexto = textoProducto.includes(consulta);
    const coincideCategoria = categoria === "Todas" || (producto.categoria || producto.tipo) === categoria;
    const coincideAlerta = !soloAlertas || estadoStock(producto.stock).clave !== "ok";
    return coincideTexto && coincideCategoria && coincideAlerta;
  });
  const unidades = inventario.reduce((total, producto) => total + producto.stock, 0);
  const alertas = inventario.filter((producto) => estadoStock(producto.stock).clave !== "ok").length;
  const fecha = new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });

  return (
    <article>
      <ResumenInventario
        sala={sala}
        fecha={fecha}
        salaActiva={salaActiva}
        onElegirSala={(id) => setParams({ sala: id })}
        productos={inventario.length}
        unidades={unidades}
        alertas={alertas}
        categorias={new Set(inventario.map((producto) => producto.categoria || producto.tipo)).size}
      />
      <FiltrosInventario
        busqueda={busqueda}
        onBusqueda={setBusqueda}
        categorias={categorias}
        categoria={categoria}
        onCategoria={setCategoria}
        soloAlertas={soloAlertas}
        onSoloAlertas={setSoloAlertas}
      />
      <Aviso onCerrar={cerrar}>{texto}</Aviso>
      {!puedeEditar ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-caqui bg-papel px-4 py-3 font-texto">
          <span>
            {sesion
              ? `Entraste como ${etiquetaCuenta(sesion.id)}. Solo puedes actualizar el stock de tu propia sala.`
              : `Para actualizar el stock de ${sala.nombre} inicia sesión con las credenciales de esa sala.`}
          </span>
          {sesion?.tipo === "sala" ? (
            <button type="button" className="font-ui font-semibold underline" onClick={() => setParams({ sala: sesion.id })}>
              Ver mi sala
            </button>
          ) : (
            <Link to="/ingresar-empresa" state={{ desde: `/inventario?sala=${salaActiva}` }} className="font-ui font-semibold underline">
              Ingresar
            </Link>
          )}
        </div>
      ) : null}
      <p className="mt-4 font-texto" role="status">
        Mostrando {visibles.length} de {inventario.length} productos en {sala.nombre}
      </p>
      {visibles.length === 0 ? (
        <p className="mt-4 font-texto">No hay productos que coincidan con la búsqueda.</p>
      ) : (
        <ul className="mt-4 grid list-none gap-4 md:grid-cols-2">
          {visibles.map((producto) => (
            <li key={producto.id}>
              <TarjetaProducto producto={producto} salaId={salaActiva} puedeEditar={puedeEditar} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
