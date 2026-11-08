import { Link } from "react-router";

const VARIANTES = {
  primario: "border border-caqui bg-caqui text-verde-oscuro hover:bg-papel",
  secundario: "border border-caqui bg-transparent text-verde hover:bg-caqui hover:text-verde-oscuro",
  peligro: "border-0 bg-transparent px-0 text-[#7d3428] underline",
  alerta: "border border-[#7d3428] bg-papel text-[#7d3428] hover:bg-[#f4e4de]",
};

export default function Boton({ to, children, variante = "primario", className = "", ...props }) {
  const clases = `inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-center font-ui text-base font-semibold ${VARIANTES[variante]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={clases} {...props}>
      {children}
    </button>
  );
}
