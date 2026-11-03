# Supermercado PFY2202

Sitio de inventario de **Supermercado PFY2202**, desarrollado para Desarrollo Frontend II (PFY2202). La aplicación está en `supermercado-PFY2202`.

El inventario vive en un estado global de React. Cada artículo guarda nombre, marca y tipo, además de precio y stock por sala. En el encabezado, a la izquierda del acceso, están el formulario para incorporar productos y la tabla del inventario. Un artículo nuevo solo se agrega con la sesión de una sala, y el stock inicial queda en esa sala. Desde la tabla, esa misma sesión puede editar o eliminar un artículo. Los estilos de esas vistas usan Tailwind CSS.

El inicio muestra el inventario de tres salas: San Bernardo, La Pintana y Puente Alto. El menú inferior abre tres secciones:

- Inventario
- Quiénes somos
- Contactos

Cada sala tiene su propio usuario. El stock de una sala solo cambia con la sesión de esa sala. En Contactos, los datos de las sedes se muestran siempre. Las consultas entre salas, o con administración, parten como pendientes y se cierran cuando las dos partes las marcan como resueltas.

Las consultas entre cuentas se simulan en el mismo navegador. El historial queda en `localStorage` de ese navegador y no se sincroniza entre equipos.

## Rutas

| Ruta | Qué muestra |
| --- | --- |
| `/` | Inventario de la sala elegida |
| `/quienes-somos` | Historia de la cadena y uso del sitio |
| `/contactos` | Datos de las sedes e historial de consultas |
| `/contactos/:id` | Hilo de una consulta |
| `/ingresar` | Acceso de una sala o de administración |
| `/producto/:sala/:id` | Ficha de un producto en una sala |
| `/nuevo-articulo` | Formulario para agregar un artículo a la sala con sesión |
| `/editar-articulo/:id` | Edición de un artículo de la sala con sesión |
| `/articulos` | Tabla de todos los artículos del inventario |
| cualquier otra | Página no encontrada |

La navegación usa React Router v6 (`BrowserRouter`, `Routes`, `Route`, `Link`, `useLocation` y `useNavigate`). El menú cambia de sección sin recargar el sitio. La ruta `*` queda al final.

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
