import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInventario } from "../context/InventarioContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { SALAS } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";
import { formatoPrecio } from "../utils/formato.js";

export default function TablaArticulos() {
  useTitulo("Tabla de inventario");
  const { productos, eliminarArticulo } = useInventario();
  const { sesion } = useSesion();
  const location = useLocation();
  const [ocultarAviso, setOcultarAviso] = useState(false);
  const [avisoLocal, setAvisoLocal] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);
  const sala = sesion?.tipo === "sala" ? sesion : null;
  const aviso = avisoLocal || location.state?.aviso || "";
  const salaEnlace = sala?.id ?? "san-bernardo";

  function eliminar(id) {
    const ok = eliminarArticulo(id);
    setConfirmarId(null);
    setOcultarAviso(false);
    setAvisoLocal(
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
      <Link to="/" className="boton boton--secundario mt-4">
        Volver al inventario
      </Link>

      {aviso && !ocultarAviso ? (
        <p className="aviso mt-4" role="status">
          <span>{aviso}</span>
          <button type="button" onClick={() => setOcultarAviso(true)}>
            Cerrar
          </button>
        </p>
      ) : null}

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
            {productos.map((producto) => (
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
                      <Link to={`/editar-articulo/${producto.id}`}>Editar</Link>
                      {confirmarId === producto.id ? (
                        <>
                          <button type="button" className="peligro" onClick={() => eliminar(producto.id)}>
                            Confirmar
                          </button>
                          <button type="button" onClick={() => setConfirmarId(null)}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button type="button" className="peligro" onClick={() => setConfirmarId(producto.id)}>
                          Eliminar
                        </button>
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
