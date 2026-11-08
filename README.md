# Supermercado PFY2202

Sitio de compra e inventario de **Supermercado PFY2202**, desarrollado para Desarrollo Frontend II (PFY2202). La aplicación está en `supermercado-PFY2202`.

Hay tres salas: San Bernardo, La Pintana y Puente Alto. Cada una guarda su propio stock. El inventario, el carrito, las cuentas nuevas y las consultas viven en `localStorage` de este navegador y no se sincronizan entre equipos.

El nombre pedido para el repositorio de entrega es `supermercado-nombre-apellido-siglaCurso`.

## Cómo se usa

La primera pantalla es el supermercado. La barra de arriba permanece fija al bajar. A la izquierda muestra la marca y, con sesión, el nombre en texto caqui. A la derecha cambia según quién entró. El menú de abajo cambia de sección sin recargar la página.

### Visita, cliente y empresa

Sin sesión se puede mirar el supermercado, filtrar por categoría y abrir la ficha de un producto. El ícono del carrito abre el panel, que pide iniciar sesión. El menú de abajo muestra Supermercado, Quiénes somos y Contactos. En Contactos se ven los datos de las sedes. El historial de mensajes queda oculto.

Un cliente entra en `/ingresar`. Puede usar la cuenta de demostración o crear una nueva. El formulario tiene un botón hacia el ingreso de administración. Después de entrar, el menú sigue siendo el de compra y el carrito queda asociado a esa cuenta. Si un cliente abre Inventario, la tabla o el alta de artículos, vuelve al supermercado. El carrito, sin cliente, vuelve a `/ingresar`.

Una sala o administración entra en `/ingresar-empresa` y llega al inventario. El menú de abajo pasa a Inventario, Quiénes somos y Contactos. Arriba aparecen Ingresar artículo, Tabla de inventario y Salir. El ícono del carrito no se muestra.

### Comprar

En el supermercado se elige la sala. Las tarjetas muestran el stock de esa sala. Las categorías arman una lista aparte: al volver a «Todas» reaparecen los mismos productos. El inventario original no se reemplaza.

«Añadir al carrito» suma una unidad, abre el panel y el botón de esa tarjeta pasa a «En el carrito». Volver a pulsarlo solo abre el panel. Para llevar más unidades se usa el más del carrito. Con stock en cero el botón queda en «Sin stock». Si quien pulsa añadir no tiene sesión de cliente, el sitio lo lleva a iniciar sesión y después puede volver al producto.

El nombre del producto abre `/producto/:sala/:id`. La ficha muestra categoría, descripción, SKU, pasillo, precio, objetivo y las unidades disponibles en esa sala. Desde ahí también se agrega al carrito.

### Carrito

El panel lateral y la página `/carrito` usan la misma lista. Cada línea muestra cantidad, precio y subtotal. Subir la cantidad descuenta otra unidad de la sala. Bajarla o pulsar Quitar devuelve esas unidades. En uno, el menos queda desactivado y la línea se saca con Quitar. Abajo se ven la cantidad de productos y el total.

«Detalle carrito» abre `/carrito`. Desde esa página, «Volver al supermercado» regresa a la sala en la que se está comprando.

El carrito de un cliente pertenece a una sola sala. Si ya tiene artículos y se elige otra sala, aparece un aviso. Al confirmar, cada artículo se devuelve a la sala de origen y se toma de la sala nueva solo hasta el stock que exista. Si allá no hay stock, el artículo sale del carrito.

### Inventario de la sala

Inventario muestra el resumen de la sala elegida: productos, unidades, alertas y categorías. Se puede buscar por nombre, SKU o categoría, filtrar por categoría y dejar solo las alertas. Esos filtros tampoco modifican la lista guardada.

Los botones de más, menos y el número escrito actualizan el stock de la sala con sesión, entre 0 y 999. Una sala puede mirar las otras, pero el control solo se activa en la suya. Administración y una visita pueden revisar; el aviso indica que el stock lo actualiza la sala correspondiente.

### Artículos

Ingresar artículo abre el formulario de la sala con sesión. Al guardar, el artículo entra al inventario de las tres salas y la tabla lo muestra de inmediato.

La tabla, en `/articulos`, lista todos los artículos: nombre, marca, tipo, precio y el stock de cada sala. El selector de categoría deja ver un grupo sin borrar el resto. El nombre abre la ficha. Con sesión de sala, cada fila tiene Editar y Eliminar. Eliminar los reemplaza por Cancelar y Confirmar. Confirmar quita el artículo de las tres salas. Administración ve la tabla y no tiene esas acciones.

### Contactos

Los datos de las tres salas y de administración se ven siempre. Los mensajes dependen de la sesión.

Un cliente solo abre una consulta hacia una sala. Una sala escribe a las otras salas y a administración, y responde a un cliente cuando ese cliente escribió primero. Administración solo escribe a las salas y no ve los hilos de los clientes.

Al enviar, la consulta nace Pendiente y se abre su hilo. Ahí se responde. Cada parte puede marcarla Resuelta. Se cierra cuando las dos lo hicieron y, desde ese momento, ya no admite respuestas. «Volver a contactos» regresa a las sedes y al historial.

## Rutas

| Ruta | Qué muestra |
| --- | --- |
| `/` | Supermercado de la sala elegida |
| `/carrito` | Artículos del cliente en la sala donde está comprando |
| `/inventario` | Inventario de la sala, para el acceso de empresa |
| `/quienes-somos` | Historia de la cadena y uso del sitio |
| `/contactos` | Datos de las sedes e historial de consultas |
| `/contactos/:id` | Hilo de una consulta |
| `/ingresar` | Ingreso y registro de clientes |
| `/ingresar-empresa` | Ingreso de las salas y de administración |
| `/producto/:sala/:id` | Ficha de un producto. El cliente lo agrega al carrito |
| `/nuevo-articulo` | Formulario para agregar un artículo a la sala con sesión |
| `/editar-articulo/:id` | Edición de un artículo de la sala con sesión |
| `/articulos` | Tabla de todos los artículos, con filtro por categoría |
| cualquier otra | Página no encontrada |

La navegación usa React Router (`BrowserRouter`, `Routes` y `Route` en `src/routes/AppRoutes.jsx`). El menú cambia de sección sin recargar el sitio. La ruta `*` queda al final.

## Organización

El estado está partido en contextos: sesión, inventario, carrito y consultas. Las rutas viven en `src/routes/AppRoutes.jsx`. Las validaciones de formularios están en `src/utils/validaciones.js` y se reutilizan al crear artículos, cuentas y consultas.

Los componentes compartidos son el botón, el aviso, la tabla de credenciales, la tarjeta de producto y la lista del carrito. Esa lista se usa tanto en el panel lateral como en `/carrito`. El inventario se parte en resumen, filtros y tarjeta. Contactos se parte en sedes, formulario e historial.

## Estilos

Los estilos usan Tailwind CSS 4, con la paleta definida en `src/index.css`: verde, caqui, papel y crema. Las grillas pasan de una columna a dos o más según el ancho (`sm`, `md` y `lg`). La tabla de artículos se desplaza en horizontal cuando no cabe, y el menú inferior queda fijo en el teléfono.

## Cuentas de demostración

| Acceso | Usuario | Clave |
| --- | --- | --- |
| Cliente demostración | `cliente` | `cliente-PFY2202` |
| Sala San Bernardo | `sanbernardo` | `sanbernardo-PFY2202` |
| Sala La Pintana | `lapintana` | `lapintana-PFY2202` |
| Sala Puente Alto | `puentealto` | `puentealto-PFY2202` |
| Administración | `administracion` | `administracion-PFY2202` |

## Ejecución

Los comandos de instalación y ejecución se corren dentro de `supermercado-PFY2202`:

```bash
cd supermercado-PFY2202
npm install
npm start
```

`npm run dev` hace lo mismo. El sitio queda en `http://localhost:5173`.

`npm run build` genera la versión de producción en `supermercado-PFY2202/dist`.

## Publicación

GitHub Actions publica el sitio al recibir un push en `main`. El flujo está en `.github/workflows/pages.yml`: instala la aplicación, la construye y despliega `dist` en GitHub Pages.

La dirección publicada es `https://sebastiantapia1104.github.io/Desarrollo-Frontend-II/`. En ese entorno la base de las rutas es el nombre del repositorio. En local la base sigue siendo `/`. Si Pages no encuentra una ruta del cliente, `404.html` devuelve la aplicación a esa misma dirección.
