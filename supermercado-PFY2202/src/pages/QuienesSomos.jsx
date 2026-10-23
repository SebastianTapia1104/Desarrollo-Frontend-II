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
      "Inventario es el inicio: ahí se elige la sala y se ve su stock.",
      "Quiénes somos explica la cadena y el funcionamiento de cada parte.",
      "Contactos junta los datos públicos de las sedes y los mensajes internos.",
      "Ingresar está en la esquina superior. Salir cierra la sesión de esa sala.",
    ],
  },
  {
    titulo: "Inventario",
    texto: "Cada sala tiene su propio stock. Puedes mirar San Bernardo, La Pintana o Puente Alto sin entrar: la búsqueda, las categorías y el filtro de alertas sirven para revisar. Los botones de más y menos solo se activan si la sesión corresponde a esa sala. Una sala no modifica la góndola de otra.",
    pasos: [
      "Elige la sala en la fila de arriba. El resumen de unidades cambia con ella.",
      "Abre la ficha de un producto para ver pasillo, precio y objetivo de sala.",
      "Para reponer o descontar, entra con el usuario de esa sede.",
      "Si estás en otra sala, el aviso te lleva de vuelta a la tuya.",
    ],
  },
  {
    titulo: "Contactos",
    texto: "Hay dos usos distintos en la misma página. El bloque Contacto para externos muestra dirección, horario, teléfono y correo de las tres salas y de la casa matriz. Esa información se ve siempre, con o sin sesión. Más abajo están los mensajes de trabajo: una sala escribe a otra sala o a administración.",
    pasos: [
      "Sin sesión solo se ven los datos públicos. El historial interno queda oculto.",
      "Con sesión eliges el destino, escribes el asunto y el mensaje. La consulta nace Pendiente.",
      "En el hilo se responde directo. Cada parte ve si la otra ya marcó Resuelta.",
      "La consulta se cierra recién cuando las dos partes la marcan. Ahí ya no admite respuestas.",
      "Desde una conversación, Volver a contactos regresa al listado y a los datos de las sedes.",
    ],
  },
];

export default function QuienesSomos() {
  useTitulo("Quiénes somos");

  return (
    <article className="pagina">
      <section className="bento bento--tablero" aria-label="La cadena">
        <div className="celda celda--hero">
          <p className="eyebrow">La cadena</p>
          <h1>Quiénes somos</h1>
          <p className="lead">
            Supermercado PFY2202 partió en San Bernardo. Hoy opera tres salas —San Bernardo,
            La Pintana y Puente Alto— y cada una cuida su propia góndola.
          </p>
        </div>
        <p className="estadistica celda">
          <strong>3</strong>
          <span>salas en la Región Metropolitana</span>
        </p>
        <p className="estadistica celda">
          <strong>90</strong>
          <span>personas en el equipo</span>
        </p>
        <p className="estadistica celda celda--doble">
          <strong>2.400</strong>
          <span>productos activos</span>
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

      <section className="bloque">
        <h2>Accesos de demostración</h2>
        <div className="celda">
        <p className="lead">
          Las claves viven en el navegador, para poder probar el sitio sin un servidor.
          Administración existe para responder y cerrar las consultas que le envían las salas.
        </p>
        <div className="tabla-contenedor">
        <table className="tabla">
          <caption className="sr-only">Usuarios y claves de cada acceso</caption>
          <thead>
            <tr>
              <th>Acceso</th>
              <th>Usuario</th>
              <th>Clave</th>
            </tr>
          </thead>
          <tbody>
            {CUENTAS.map((cuenta) => (
              <tr key={cuenta.id}>
                <td>{cuenta.tipo === "sala" ? `Sala ${cuenta.nombre}` : cuenta.nombre}</td>
                <td>
                  <code>{cuenta.usuario}</code>
                </td>
                <td>
                  <code>{cuenta.clave}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
      </section>
    </article>
  );
}
