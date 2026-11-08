import Boton from "../components/Boton.jsx";
import ListaCarrito from "../components/carrito/ListaCarrito.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useInventario } from "../context/InventarioContext.jsx";
import { SALAS } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";
import { useState } from "react";

export default function Carrito() {
  useTitulo("Carrito");
  const { productos } = useInventario();
  const { lineas, salaId, cambiar, quitar } = useCarrito();
  const [aviso, setAviso] = useState("");
  const sala = SALAS.find((item) => item.id === salaId);

  return (
    <article className="mx-auto max-w-xl">
      <h1 className="font-titulo text-4xl font-semibold text-tinta">Carrito</h1>
      <p className="mt-3 font-texto text-lg text-tinta/80">
        {sala
          ? `Estas unidades se descuentan de ${sala.nombre}. Subir la cantidad vuelve a descontar; bajarla o quitar el artículo devuelve el stock.`
          : "El carrito se abre también desde el ícono de arriba, al añadir un producto."}
      </p>
      <section className="mt-6 rounded-2xl border border-caqui bg-papel p-4">
        <ListaCarrito
          lineas={lineas}
          productos={productos}
          aviso={aviso}
          onCambiar={(productoId, delta) => setAviso(cambiar(productoId, delta))}
          onQuitar={(productoId) => {
            setAviso("");
            quitar(productoId);
          }}
        />
      </section>
      <Boton to={sala ? `/?sala=${sala.id}` : "/"} variante="secundario" className="mt-4">
        Volver al supermercado
      </Boton>
    </article>
  );
}
