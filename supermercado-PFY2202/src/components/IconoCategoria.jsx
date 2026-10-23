import { slugCategoria } from "../utils/formato.js";

export default function IconoCategoria({ categoria }) {
  return (
    <span
      className={`icono-cat icono-cat--${slugCategoria(categoria)}`}
      aria-hidden="true"
    >
      {categoria.slice(0, 1)}
    </span>
  );
}
