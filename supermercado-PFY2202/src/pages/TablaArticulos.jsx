import { useState } from "react";
import { Link } from "react-router";
import Aviso from "../components/Aviso.jsx";
import { useInventario } from "../context/InventarioContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { SALAS } from "../data/salas.js";
import useAviso from "../hooks/useAviso.js";
import useTitulo from "../hooks/useTitulo.js";
import { formatoPrecio } from "../utils/formato.js";

export default function TablaArticulos() {
  useTitulo("Tabla de inventario");
  const { productos, eliminarArticulo } = useInventario();
  const { sesion } = useSesion();
  const { texto, mostrar, cerrar } = useAviso();
  const [categoria, setCategoria] = useState("Todas");
  const [confirmarId, setConfirmarId] = useState(null);
  const sala = sesion?.tipo === "sala" ? sesion : null;
  const salaEnlace = sala?.id ?? "san-bernardo";
  const categorias = ["Todas", ...new Set(productos.map((producto) => producto.categoria || producto.tipo))];
  const visibles = productos.filter(
    (producto) => categoria === "Todas" || (producto.categoria || producto.tipo) === categoria
  );

  function eliminar(id) {
    const ok = eliminarArticulo(id);
    setConfirmarId(null);
    mostrar(
      ok
        ? "El artículo se eliminó del inventario de las tres salas."
        : "Inicia sesión en una sala para eliminar un artículo."
    );
  }

  return (
    <section>
      <p className="font-ui text-base font-semibold text-verde">Inventario</p>
      <h1 className="mt-1 font-titulo text-4xl font-semibold text-tinta">Tabla de inventario</h1>
      <p className="mt-3 max-w-2xl font-texto text-lg leading-relaxed text-tinta/80">
        Todos los artículos del estado global, con marca, tipo y el stock de cada sala.
        {sala
          ? ` Editar y eliminar está disponible con la sesión de ${sala.nombre}.`
          : " Para editar o eliminar, inicia sesión en una sala."}
      </p>
      <Link to="/inventario" className="boton boton--secundario mt-4">
        Volver al inventario
      </Link>
      <label className="mt-4 flex flex-wrap items-center gap-2 font-ui text-sm font-semibold">
        Categoría
        <select value={categoria} onChange={(evento) => setCategoria(evento.target.value)} className="rounded-lg border border-caqui bg-papel px-3 py-2">
          {categorias.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <p className="mt-2 font-texto" role="status">
        Mostrando {visibles.length} de {productos.length} artículos. El filtro no modifica el inventario.
      </p>
      <Aviso onCerrar={cerrar}>{texto}</Aviso>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-caqui bg-papel">
        <table className="w-full min-w-[52rem] border-collapse text-left">
          <caption className="sr-only">Artículos disponibles en el inventario</caption>
          <thead className="bg-verde font-ui text-sm text-papel">
            <tr>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Marca</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              {SALAS.map((item) => (
                <th key={item.id} className="px-4 py-3 font-semibold">
                  {item.nombre}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="font-texto text-base text-tinta">
            {visibles.map((producto) => (
              <tr key={producto.id} className="border-t border-caqui/70">
                <td className="px-4 py-3">
                  <Link
                    to={`/producto/${salaEnlace}/${producto.id}`}
                    className="font-semibold text-verde underline"
                  >
                    {producto.nombre}
                  </Link>
                </td>
                <td className="px-4 py-3">{producto.marca}</td>
                <td className="px-4 py-3">{producto.tipo}</td>
                <td className="px-4 py-3">{formatoPrecio(producto.precio)}</td>
                {SALAS.map((item) => (
                  <td key={item.id} className="px-4 py-3">
                    {producto.stockPorSala[item.id] ?? 0}
                  </td>
                ))}
                <td className="px-4 py-3">
                  {sala ? (
                    <div className="acciones-articulo">
                      {confirmarId === producto.id ? (
                        <>
                          <button type="button" onClick={() => setConfirmarId(null)}>
                            Cancelar
                          </button>
                          <button type="button" className="confirmar" onClick={() => eliminar(producto.id)}>
                            Confirmar
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to={`/editar-articulo/${producto.id}`}>Editar</Link>
                          <button type="button" className="peligro" onClick={() => setConfirmarId(producto.id)}>
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-tinta/70">Requiere sesión de sala</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
