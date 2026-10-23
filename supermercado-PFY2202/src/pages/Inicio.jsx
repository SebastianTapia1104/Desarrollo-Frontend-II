import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import BarraStock from "../components/BarraStock.jsx";
import ControlStock from "../components/ControlStock.jsx";
import IconoCategoria from "../components/IconoCategoria.jsx";
import { useInventario } from "../context/InventarioContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { SALAS, etiquetaCuenta } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";
import { estadoStock, formatoPrecio, normalizar } from "../utils/formato.js";

export default function Inicio() {
  useTitulo("Inventario de sala");
  const { productos } = useInventario();
  const { sesion } = useSesion();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const aviso = location.state?.aviso ?? "";
  const [ocultarAviso, setOcultarAviso] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [soloAlertas, setSoloAlertas] = useState(false);

  const salaPedida = params.get("sala");
  const salaActiva =
    SALAS.find((sala) => sala.id === salaPedida)?.id ??
    (sesion?.tipo === "sala" ? sesion.id : SALAS[0].id);
  const sala = SALAS.find((item) => item.id === salaActiva);
  const puedeEditar = sesion?.tipo === "sala" && sesion.id === salaActiva;

  const inventario = productos.map((producto) => ({
    ...producto,
    stock: producto.stockPorSala[salaActiva] ?? 0,
  }));
  const categorias = ["Todas", ...new Set(inventario.map((producto) => producto.categoria))];
  const consulta = normalizar(busqueda.trim());
  const visibles = inventario.filter((producto) => {
    const texto = normalizar(`${producto.nombre} ${producto.sku} ${producto.categoria}`);
    const coincideTexto = texto.includes(consulta);
    const coincideCategoria = categoria === "Todas" || producto.categoria === categoria;
    const coincideAlerta = !soloAlertas || estadoStock(producto.stock).clave !== "ok";
    return coincideTexto && coincideCategoria && coincideAlerta;
  });

  const unidades = inventario.reduce((total, producto) => total + producto.stock, 0);
  const alertas = inventario.filter((producto) => estadoStock(producto.stock).clave !== "ok").length;
  const fecha = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <article className="pagina">
      <section className="bento bento--tablero" aria-label="Resumen de la sala">
        <div className="celda celda--hero">
          <div>
            <p className="eyebrow">
              Sala {sala.nombre} · {fecha}
            </p>
            <h1>Inventario de sala</h1>
            <p className="lead">
              Elige una sala para revisar su stock. Para reponer o descontar unidades tienes que
              iniciar sesión con las credenciales de esa sala.
            </p>
          </div>
          <div className="chips" role="tablist" aria-label="Salas">
            {SALAS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === salaActiva}
                className={item.id === salaActiva ? "chip chip--activo" : "chip"}
                onClick={() => setParams({ sala: item.id })}
              >
                {item.nombre}
              </button>
            ))}
          </div>
        </div>

        <p className="estadistica celda">
          <strong>{inventario.length}</strong>
          <span>productos</span>
        </p>
        <p className="estadistica celda">
          <strong>{unidades}</strong>
          <span>unidades en sala</span>
        </p>
        <p className="estadistica estadistica--alerta celda celda--doble">
          <strong>{alertas}</strong>
          <span>alertas de stock</span>
        </p>

        <section className="celda celda--banda filtros" aria-label="Filtros del inventario">
          <label className="busqueda">
            <span className="sr-only">Buscar producto</span>
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por nombre o SKU"
            />
          </label>

          <div className="chips" role="group" aria-label="Categorías">
            {categorias.map((item) => (
              <button
                key={item}
                type="button"
                className={item === categoria ? "chip chip--activo" : "chip"}
                aria-pressed={item === categoria}
                onClick={() => setCategoria(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="alerta-filtro">
            <input
              type="checkbox"
              checked={soloAlertas}
              onChange={(evento) => setSoloAlertas(evento.target.checked)}
            />
            Solo alertas
          </label>
        </section>
      </section>

      {aviso && !ocultarAviso ? (
        <p className="aviso" role="status">
          <span>{aviso}</span>
          <button type="button" onClick={() => setOcultarAviso(true)}>
            Cerrar
          </button>
        </p>
      ) : null}

      {!puedeEditar ? (
        <div className="aviso">
          <span>
            {sesion
              ? `Entraste como ${etiquetaCuenta(sesion.id)}. Solo puedes actualizar el stock de tu propia sala.`
              : `Para actualizar el stock de ${sala.nombre} inicia sesión con las credenciales de esa sala.`}
          </span>
          {sesion?.tipo === "sala" ? (
            <button type="button" onClick={() => setParams({ sala: sesion.id })}>
              Ver mi sala
            </button>
          ) : (
            <Link to="/ingresar" state={{ desde: `/?sala=${salaActiva}` }}>
              Ingresar
            </Link>
          )}
        </div>
      ) : null}

      <p className="resumen-lista" role="status">
        Mostrando {visibles.length} de {inventario.length} productos en {sala.nombre}
      </p>

      {visibles.length === 0 ? (
        <p className="vacio">No hay productos que coincidan con la búsqueda.</p>
      ) : (
        <ul className="lista-productos bento bento--productos">
          {visibles.map((producto) => (
            <li key={producto.id}>
              <article className="tarjeta">
                <div className="tarjeta__cabecera">
                  <IconoCategoria categoria={producto.categoria} />
                  <div className="tarjeta__texto">
                    <h2>
                      <Link to={`/producto/${salaActiva}/${producto.id}`}>{producto.nombre}</Link>
                    </h2>
                    <p className="tarjeta__meta">
                      {producto.categoria} · SKU {producto.sku} · Pasillo {producto.pasillo}
                    </p>
                  </div>
                  <p className="tarjeta__precio">{formatoPrecio(producto.precio)}</p>
                </div>
                <div className="tarjeta__pie">
                  <BarraStock stock={producto.stock} objetivo={producto.stockObjetivo} />
                  <ControlStock producto={producto} salaId={salaActiva} puedeEditar={puedeEditar} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
