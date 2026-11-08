export default function Aviso({ children, onCerrar, error = false }) {
  if (!children) return null;

  return (
    <p
      role={error ? "alert" : "status"}
      className={`mt-4 flex flex-wrap items-start justify-between gap-3 rounded-xl border px-4 py-3 font-texto ${
        error ? "border-[#7d3428] bg-[#f4e4de] text-[#7d3428]" : "border-caqui bg-papel text-tinta"
      }`}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {onCerrar ? (
        <button type="button" className="font-ui font-semibold underline" onClick={onCerrar}>
          Cerrar
        </button>
      ) : null}
    </p>
  );
}
