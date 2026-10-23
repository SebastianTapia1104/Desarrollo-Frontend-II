# Supermercado PFY2202

Sitio de **Supermercado PFY2202** para la actividad formativa de Desarrollo Frontend II (PFY2202), semana 1: *Utilizando tecnologías avanzadas de React en sitios web*.

La aplicación está en la carpeta `supermercado-PFY2202`. Este README queda en la raíz del repositorio, que es la carpeta del curso.

El home es el inventario de tres salas: San Bernardo, La Pintana y Puente Alto. El menú inferior navega a las dos páginas elegidas de la lista de la forma B:

- Quiénes somos
- Contactos

Cada sala tiene su propio usuario. El stock solo se modifica con la sesión de esa sala. En Contactos, los datos de las sedes se ven siempre. Las consultas internas parten como pendientes y se cierran cuando las dos partes las marcan como resueltas.

## Rutas

| Ruta | Qué muestra |
| --- | --- |
| `/` | Inventario de la sala elegida |
| `/quienes-somos` | Historia y cómo usar el sitio |
| `/contactos` | Datos de las sedes y historial de consultas |
| `/contactos/:id` | Hilo de una consulta |
| `/ingresar` | Acceso de sala o administración |
| `/producto/:sala/:id` | Ficha de un producto en una sala |
| cualquier otra | Página no encontrada |

La navegación usa **React Router v6** (`BrowserRouter`, `Routes`, `Route`, `Link`, `useLocation` y `useNavigate`). Los enlaces del menú no recargan el sitio. La ruta `*` queda al final.

## Cómo ejecutarlo

Desde la carpeta de la aplicación:

```bash
cd supermercado-PFY2202
npm install
npm start
```

También sirve `npm run dev`. La aplicación queda en `http://localhost:5173`.

`npm run build` genera la versión de producción en `supermercado-PFY2202/dist`.

## Qué subir al repositorio

La raíz del repositorio es esta carpeta. No hace falta subir `node_modules` ni `dist`: se regeneran con `npm install` y `npm run build`. El archivo `.gitignore` ya los excluye, junto con los PDF del curso.

## Publicar el sitio en GitHub Pages

El flujo está en `.github/workflows/pages.yml`. Construye `supermercado-PFY2202` y publica `dist`.

1. Crea el repositorio en GitHub y súbelo con la rama `main`.
2. En el repositorio, abre **Settings → Pages** y deja el origen en **GitHub Actions**.
3. Al hacer push a `main`, la acción publica el sitio.
4. La dirección queda en `https://USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`.

En local la base de las rutas sigue siendo `/`. En Pages, la construcción usa el nombre del repositorio para que los enlaces y el favicon apunten dentro de esa carpeta. Si alguien abre una ruta directo (por ejemplo `/quienes-somos`) y GitHub responde 404, `404.html` devuelve la aplicación a esa misma ruta.
