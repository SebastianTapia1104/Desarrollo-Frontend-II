import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BarraStock from "../components/BarraStock.jsx";
import ControlStock from "../components/ControlStock.jsx";
import { useInventario } from "../context/InventarioContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { SALAS } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";
import { decodificarSegmento, formatoPrecio } from "../utils/formato.js";

export default function DetalleProducto() {
  const { sala: salaParam, id: idParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { productos } = useInventario();
  const { sesion } = useSesion();

  const segmentos = location.pathname.split("/").filter(Boolean);
  const salaDesdeRuta = decodificarSegmento(segmentos[1] ?? "");
  const idDesdeRuta = decodificarSegmento(segmentos[2] ?? "");
  const salaId = salaParam ?? salaDesdeRuta;
  const id = idParam ?? idDesdeRuta;
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

  return (
    <article className="pagina">
      <nav className="miga" aria-label="Miga de pan">
        <Link to={`/?sala=${sala.id}`}>Inventario</Link>
        <span aria-hidden="true">/</span>
        <span>{sala.nombre}</span>
        <span aria-hidden="true">/</span>
        <span>{idDesdeRuta}</span>
      </nav>

      {!puedeEditar ? (
        <div className="aviso">
          <span>El stock de esta ficha solo lo actualiza la sala con sesión iniciada.</span>
          <Link to="/ingresar" state={{ desde: location.pathname }}>
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
          <ControlStock producto={vista} salaId={sala.id} puedeEditar={puedeEditar} anunciar />
          <BarraStock stock={stock} objetivo={producto.stockObjetivo} />
        </div>
      </section>

      <Link to={`/?sala=${sala.id}`} className="boton boton--secundario">
        Volver al inventario
      </Link>
    </article>
  );
}
