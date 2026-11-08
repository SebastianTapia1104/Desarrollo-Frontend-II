export default function TarjetaSede({ nombre, lineas }) {
  return (
    <article className="rounded-2xl border border-caqui bg-papel p-4">
      <h3 className="font-titulo text-xl font-semibold">{nombre}</h3>
      {lineas.map((linea) => (
        <p key={linea} className="mt-1 font-texto text-tinta/80">
          {linea.includes("@") ? <Correo correo={linea} /> : linea}
        </p>
      ))}
    </article>
  );
}

function Correo({ correo }) {
  const corte = correo.indexOf("@");
  if (corte === -1) return correo;
  return (
    <>
      {correo.slice(0, corte + 1)}
      <wbr />
      {correo.slice(corte + 1)}
    </>
  );
}
