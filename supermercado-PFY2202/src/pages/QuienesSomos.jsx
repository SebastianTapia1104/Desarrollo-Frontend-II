import { useInventario } from "../context/InventarioContext.jsx";
import TablaCredenciales from "../components/TablaCredenciales.jsx";
import { CLIENTE_DEMO } from "../data/clientes.js";
import { CUENTAS } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";

const HITOS = [
  {
    anio: "1998",
    texto: "Abrimos la primera sala en Av. PFY 2202, San Bernardo, con una góndola de barrio y panadería propia.",
  },
  {
    anio: "2011",
    texto: "Sumamos la sala de La Pintana. El surtido sigue siendo corto y cada pasillo se repone en el día.",
  },
  {
    anio: "2018",
    texto: "Puente Alto se incorpora a la cadena. Desde entonces cada sala controla su propio stock.",
  },
  {
    anio: "2026",
    texto: "Esta herramienta deja el inventario de las tres salas a la vista de quien repone, con un acceso distinto por sala.",
  },
];

const SECCIONES = [
  {
    titulo: "Cómo moverse",
    texto: "El sitio es una sola aplicación. El menú de abajo cambia la sección y la dirección del navegador, pero no recarga la página. El botón Atrás del navegador vuelve a la vista anterior y conserva lo que ya ajustaste.",
    pasos: [
      "Supermercado es la primera pantalla: el cliente elige la sala y el carrito se abre al añadir un producto. Cambiar de sala con artículos pide confirmación, porque la otra sala puede no tener el mismo stock.",
      "Inventario aparece en el menú cuando entra una sala o administración.",
      "Quiénes somos explica la cadena y el funcionamiento de cada parte.",
      "Contactos junta los datos públicos de las sedes y los mensajes internos.",
      "Ingresar artículo y Tabla de inventario están arriba, solo con acceso de empresa.",
    ],
  },
  {
    titulo: "Inventario",
    texto: "Cada sala tiene su propio stock. Puedes mirar San Bernardo, La Pintana o Puente Alto sin entrar: la búsqueda, las categorías y el filtro de alertas sirven para revisar. Los botones de más y menos solo se activan si la sesión corresponde a esa sala. Una sala no modifica la góndola de otra.",
    pasos: [
      "Elige la sala en la fila de arriba. El resumen de unidades cambia con ella.",
      "Abre la ficha de un producto para ver pasillo, precio y objetivo de sala.",
      "Para reponer o descontar, entra con el usuario de esa sede. El número del stock se puede pulsar para escribir la cantidad.",
      "Si estás en otra sala, el aviso te lleva de vuelta a la tuya.",
    ],
  },
  {
    titulo: "Contactos",
    texto: "Hay dos usos distintos en la misma página. El bloque de sedes se ve siempre. Un cliente escribe solo a una sala. Una sala escribe a otra sala o a administración, y responde a un cliente si ese cliente escribió primero. Administración solo escribe a las salas.",
    pasos: [
      "Sin sesión solo se ven los datos públicos. El historial interno queda oculto.",
      "Con sesión eliges el destino, escribes el asunto y el mensaje. La consulta nace Pendiente.",
      "En el hilo se responde directo. Cada parte ve si la otra ya marcó Resuelta.",
      "La consulta se cierra recién cuando las dos partes la marcan. Ahí ya no admite respuestas.",
      "Desde una conversación, Volver a contactos regresa al listado y a los datos de las sedes.",
    ],
  },
];

const ANIO_INICIO = 1998;

export default function QuienesSomos() {
  useTitulo("Quiénes somos");
  const { productos } = useInventario();
  const anios = new Date().getFullYear() - ANIO_INICIO;

  return (
    <article className="pagina">
      <section className="bento bento--tablero" aria-label="La cadena">
        <div className="celda celda--hero">
          <p className="eyebrow">La cadena</p>
          <h1>Quiénes somos</h1>
          <p className="lead">
            Supermercado PFY2202 partió en San Bernardo. Hoy opera tres salas San Bernardo,
            La Pintana y Puente Alto, y cada una cuida su propia góndola.
          </p>
        </div>
        <p className="estadistica celda">
          <strong>3</strong>
          <span>Salas en la Región Metropolitana</span>
        </p>
        <p className="estadistica celda">
          <strong>90</strong>
          <span>Personas en el equipo</span>
        </p>
        <p className="estadistica celda">
          <strong>{productos.length}</strong>
          <span>Productos activos</span>
        </p>
        <p className="estadistica celda">
          <strong>{anios}</strong>
          <span>Años en funcionamiento</span>
        </p>
      </section>

      <section className="bloque">
        <h2>Nuestra historia</h2>
        <ol className="linea-tiempo bento bento--hitos">
          {HITOS.map((hito) => (
            <li key={hito.anio} className="celda">
              <strong>{hito.anio}</strong>
              <p>{hito.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bloque">
        <h2>Cómo usar el sitio</h2>
        <ol className="guia bento bento--guia">
          {SECCIONES.map((seccion) => (
            <li key={seccion.titulo} className="celda">
              <h3>{seccion.titulo}</h3>
              <p>{seccion.texto}</p>
              <ol className="guia__pasos">
                {seccion.pasos.map((paso) => (
                  <li key={paso}>{paso}</li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </section>

      <TablaCredenciales
        cuentas={[CLIENTE_DEMO, ...CUENTAS]}
        titulo="Accesos de demostración"
        descripcion="Las claves viven en el navegador. El cliente compra en el supermercado. Las salas y administración entran por el ingreso de administración."
      />
    </article>
  );
}
