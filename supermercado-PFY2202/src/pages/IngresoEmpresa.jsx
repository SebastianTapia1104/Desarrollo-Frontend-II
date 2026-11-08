import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Boton from "../components/Boton.jsx";
import TablaCredenciales from "../components/TablaCredenciales.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { CUENTAS } from "../data/salas.js";
import useTitulo from "../hooks/useTitulo.js";

export default function IngresoEmpresa() {
  useTitulo("Ingreso de administración");
  const { sesion, ingresarEmpresa } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.desde && !location.state.desde.startsWith("/ingresar") ? location.state.desde : "/inventario";
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sesion?.tipo === "sala" || sesion?.tipo === "administracion") {
      navigate(destino, { replace: true });
    }
  }, [sesion, destino, navigate]);

  function enviar(evento) {
    evento.preventDefault();
    if (!ingresarEmpresa(usuario, clave)) {
      setError("Usuario o clave incorrectos.");
      return;
    }
    setError("");
  }

  return (
    <article>
      <section className="rounded-2xl bg-verde p-5 text-papel">
        <p className="font-ui text-sm font-semibold text-caqui">Acceso de empresa</p>
        <h1 className="mt-2 font-titulo text-4xl font-semibold">Ingreso de administración</h1>
        <p className="mt-3 max-w-2xl font-texto text-lg">
          Las tres salas y administración entran por aquí para ver el inventario y responder consultas.
        </p>
      </section>
      <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-2">
        <form className="flex flex-col rounded-2xl border border-caqui bg-papel p-5" onSubmit={enviar} noValidate>
          <h2 className="font-titulo text-2xl font-semibold">Iniciar sesión</h2>
          <div className="mt-3 grid gap-1">
            <label htmlFor="empresa-usuario" className="font-ui text-sm font-bold">Usuario</label>
            <input id="empresa-usuario" value={usuario} autoComplete="username" onChange={(evento) => setUsuario(evento.target.value)} className="rounded-lg border border-caqui bg-crema px-3 py-2" aria-invalid={Boolean(error)} />
          </div>
          <div className="mt-3 grid gap-1">
            <label htmlFor="empresa-clave" className="font-ui text-sm font-bold">Clave</label>
            <input id="empresa-clave" type="password" value={clave} autoComplete="current-password" onChange={(evento) => setClave(evento.target.value)} className="rounded-lg border border-caqui bg-crema px-3 py-2" aria-invalid={Boolean(error)} />
            {error ? <p className="text-sm text-[#7d3428]" role="alert">{error}</p> : null}
          </div>
          <div className="mt-auto grid gap-2 pt-5">
            <Boton type="submit" className="w-full">Entrar</Boton>
            <Boton to="/ingresar" variante="secundario" className="w-full">Volver al ingreso de clientes</Boton>
          </div>
        </form>
        <TablaCredenciales
          className="mt-0 h-full"
          cuentas={CUENTAS}
          titulo="Accesos de empresa"
          descripcion="Estas claves viven en el navegador, para probar el sitio sin un servidor."
        />
      </div>
    </article>
  );
}
