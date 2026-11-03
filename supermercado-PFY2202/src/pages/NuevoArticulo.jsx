import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useInventario } from "../context/InventarioContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import useTitulo from "../hooks/useTitulo.js";

const INICIAL = {
  nombre: "",
  marca: "",
  tipo: "",
  precio: "",
  stock: "",
  pasillo: "",
};

export default function NuevoArticulo() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  useTitulo(esEdicion ? "Editar artículo" : "Ingresar artículo");
  const { productos, agregarArticulo, actualizarArticulo } = useInventario();
  const { sesion } = useSesion();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const sala = sesion?.tipo === "sala" ? sesion : null;
  const producto = esEdicion ? productos.find((item) => item.id === id) : null;
  const tipos = [...new Set(productos.map((item) => item.tipo || item.categoria))];

  useEffect(() => {
    if (!esEdicion || !producto || !sala) return;
    setFormulario({
      nombre: producto.nombre,
      marca: producto.marca ?? "",
      tipo: producto.tipo || producto.categoria || "",
      precio: String(producto.precio),
      stock: String(producto.stockPorSala?.[sala.id] ?? 0),
      pasillo: String(producto.pasillo ?? ""),
    });
  }, [esEdicion, producto, sala]);

  function actualizar(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function enviar(evento) {
    evento.preventDefault();
    if (!sala) return;
    const nuevos = {};
    if (formulario.nombre.trim().length < 2) {
      nuevos.nombre = "El nombre debe tener al menos 2 caracteres.";
    }
    if (formulario.marca.trim().length < 2) {
      nuevos.marca = "La marca debe tener al menos 2 caracteres.";
    }
    if (formulario.tipo.trim().length < 2) {
      nuevos.tipo = "El tipo de producto debe tener al menos 2 caracteres.";
    }
    if (formulario.precio === "" || Number.isNaN(Number(formulario.precio)) || Number(formulario.precio) < 0) {
      nuevos.precio = "El precio debe ser un número igual o mayor a 0.";
    }
    if (!/^\d+$/.test(formulario.stock) || Number(formulario.stock) > 999) {
      nuevos.stock = "El stock inicial debe ser un número entero entre 0 y 999.";
    }
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const guardado = esEdicion ? actualizarArticulo(id, formulario) : agregarArticulo(formulario);
    if (!guardado) {
      setErrores({
        general: esEdicion
          ? "No se pudo guardar el artículo. Revisa los datos e inicia sesión en una sala."
          : "No se pudo ingresar el artículo. Revisa los datos e inicia sesión en una sala.",
      });
      return;
    }
    navigate("/articulos", {
      state: {
        aviso: esEdicion
          ? `Los cambios quedaron guardados. El stock se actualizó en ${sala.nombre}.`
          : `El artículo quedó en el inventario de ${sala.nombre}.`,
      },
    });
  }

  const motivos = Object.values(errores);

  return (
    <section className="rounded-2xl border border-caqui bg-papel p-5 sm:p-7">
      <p className="font-ui text-base font-semibold text-verde">Inventario</p>
      <h1 className="mt-1 font-titulo text-4xl font-semibold text-tinta">
        {esEdicion ? "Editar artículo" : "Ingresar artículo"}
      </h1>
      <p className="mt-3 max-w-2xl font-texto text-lg leading-relaxed text-tinta/80">
        {sala
          ? `El stock se guarda en ${sala.nombre}. Nombre, marca y tipo se ven en la tabla de las tres salas.`
          : "Para ingresar o editar un artículo tienes que iniciar sesión con una sala. El producto se agrega solo a esa tienda."}
      </p>
      <Link to="/" className="boton boton--secundario mt-4">
        Volver al inventario
      </Link>

      {!sala ? (
        <div className="aviso aviso--error mt-4" role="alert">
          <strong>No se puede ingresar el artículo.</strong>
          <ul>
            <li>Inicia sesión con el usuario de San Bernardo, La Pintana o Puente Alto.</li>
            <li>Administración no carga productos en la góndola de una sala.</li>
          </ul>
          <Link to="/ingresar" state={{ desde: esEdicion ? `/editar-articulo/${id}` : "/nuevo-articulo" }}>
            Ingresar
          </Link>
        </div>
      ) : null}

      {esEdicion && sala && !producto ? (
        <div className="aviso aviso--error mt-4" role="alert">
          <strong>Ese artículo no está en el inventario.</strong>
        </div>
      ) : null}

      {sala && (!esEdicion || producto) ? (
        <>
          {motivos.length > 0 ? (
            <div className="aviso aviso--error mt-4" role="alert">
              <strong>{esEdicion ? "No se pudo guardar el artículo." : "No se pudo ingresar el artículo."}</strong>
              <ul>
                {motivos.map((motivo) => (
                  <li key={motivo}>{motivo}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={enviar} noValidate>
            <Campo
              id="articulo-nombre"
              name="nombre"
              etiqueta="Nombre"
              value={formulario.nombre}
              onChange={actualizar}
              error={errores.nombre}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo
                id="articulo-marca"
                name="marca"
                etiqueta="Marca"
                value={formulario.marca}
                onChange={actualizar}
                error={errores.marca}
              />
              <Campo
                id="articulo-tipo"
                name="tipo"
                etiqueta="Tipo de producto"
                value={formulario.tipo}
                onChange={actualizar}
                error={errores.tipo}
                lista="tipos-producto"
              />
              <datalist id="tipos-producto">
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo} />
                ))}
              </datalist>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Campo
                id="articulo-precio"
                name="precio"
                etiqueta="Precio"
                type="number"
                min="0"
                value={formulario.precio}
                onChange={actualizar}
                error={errores.precio}
              />
              <Campo
                id="articulo-stock"
                name="stock"
                etiqueta={`Stock en ${sala.nombre}`}
                type="number"
                min="0"
                max="999"
                value={formulario.stock}
                onChange={actualizar}
                error={errores.stock}
              />
              <Campo
                id="articulo-pasillo"
                name="pasillo"
                etiqueta="Pasillo"
                value={formulario.pasillo}
                onChange={actualizar}
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-fit rounded-lg bg-verde px-5 py-3 font-ui text-base font-semibold text-papel hover:bg-verde-oscuro"
            >
              {esEdicion ? "Guardar cambios" : "Agregar al inventario"}
            </button>
          </form>
        </>
      ) : null}
    </section>
  );
}

function Campo({ id, etiqueta, error, lista, ...props }) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="font-ui text-sm font-bold text-tinta">
        {etiqueta}
      </label>
      <input
        id={id}
        list={lista}
        aria-invalid={Boolean(error)}
        className="rounded-lg border border-caqui bg-crema px-3 py-2 text-tinta outline-none focus:border-verde"
        {...props}
      />
      {error ? (
        <p className="text-sm text-[#7d3428]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
