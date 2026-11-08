import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import BarraStock from "../components/BarraStock.jsx";
import Boton from "../components/Boton.jsx";
import BotonAgregar from "../components/carrito/BotonAgregar.jsx";
import ControlStock from "../components/ControlStock.jsx";
import { useInventario } from "../context/InventarioContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { SALAS } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";
import { formatoPrecio } from "../utils/formato.js";

export default function DetalleProducto() {
  const { sala: salaId, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { productos } = useInventario();
  const { sesion } = useSesion();
  const sala = SALAS.find((item) => item.id === salaId) ?? null;
  const producto = productos.find((item) => item.id === id) ?? null;
  const stock = producto?.stockPorSala?.[salaId];

  useTitulo(producto ? producto.nombre : "Producto");

  useEffect(() => {
    if (!producto || !sala || typeof stock !== "number") {
      navigate("/", {
        replace: true,
        state: { aviso: "Ese producto no está en el inventario de la sala." },
      });
    }
  }, [producto, sala, stock, navigate]);

  if (!producto || !sala || typeof stock !== "number") {
    return null;
  }

  const vista = { ...producto, stock };
  const puedeEditar = sesion?.tipo === "sala" && sesion.id === sala.id;
  const esCliente = sesion?.tipo === "cliente";
  const volver = esCliente || !sesion ? `/?sala=${sala.id}` : `/inventario?sala=${sala.id}`;

  return (
    <article className="pagina">
      <nav className="miga" aria-label="Miga de pan">
        <Link to={volver}>{esCliente || !sesion ? "Supermercado" : "Inventario"}</Link>
        <span aria-hidden="true">/</span>
        <span>{sala.nombre}</span>
        <span aria-hidden="true">/</span>
        <span>{id}</span>
      </nav>

      {!esCliente && !puedeEditar ? (
        <div className="aviso">
          <span>
            {sesion
              ? "El stock de esta ficha solo lo actualiza la sala con sesión iniciada."
              : "Para comprar, entra como cliente. El stock de la sala lo actualiza su propio acceso."}
          </span>
          <Link to={sesion ? "/ingresar-empresa" : "/ingresar"} state={{ desde: location.pathname }}>
            Ingresar
          </Link>
        </div>
      ) : null}

      <section className="bento bento--ficha" aria-label="Ficha del producto">
        <div className="celda celda--hero">
          <p className="eyebrow">
            {producto.categoria} · Sala {sala.nombre}
          </p>
          <h1>{producto.nombre}</h1>
          <p className="lead">{producto.descripcion}</p>
        </div>
        <div className="celda ficha-dato">
          <p>SKU</p>
          <strong>{producto.sku}</strong>
        </div>
        <div className="celda ficha-dato">
          <p>Pasillo</p>
          <strong>{producto.pasillo}</strong>
        </div>
        <div className="celda ficha-dato">
          <p>Precio</p>
          <strong>{formatoPrecio(producto.precio)}</strong>
        </div>
        <div className="celda ficha-dato">
          <p>Objetivo de sala</p>
          <strong>
            {producto.stockObjetivo} {producto.unidad === "kg" ? "kg" : "unidades"}
          </strong>
        </div>
        <div className="celda celda--banda ficha__stock">
          <h2>Stock actual</h2>
          {puedeEditar ? <ControlStock producto={vista} salaId={sala.id} puedeEditar anunciar /> : null}
          <BarraStock stock={stock} objetivo={producto.stockObjetivo} />
          {esCliente || !sesion ? (
            <div className="mt-4">
              <p className="mb-3 font-texto">
                Hay {stock} {stock === 1 ? "unidad disponible" : "unidades disponibles"} en {sala.nombre}.
              </p>
              <BotonAgregar salaId={sala.id} productoId={producto.id} stock={stock} />
            </div>
          ) : null}
        </div>
      </section>

      <Boton to={volver} variante="secundario" className="mt-4">
        {esCliente || !sesion ? "Volver al supermercado" : "Volver al inventario"}
      </Boton>
    </article>
  );
}
