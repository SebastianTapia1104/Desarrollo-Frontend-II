import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Boton from "../components/Boton.jsx";
import TablaCredenciales from "../components/TablaCredenciales.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { CLIENTE_DEMO } from "../data/clientes.js";
import useTitulo from "../hooks/useTitulo.js";

export default function IngresoClientes() {
  useTitulo("Ingresar");
  const { sesion, ingresarCliente, registrarCliente } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.desde && !location.state.desde.startsWith("/ingresar") ? location.state.desde : "/";
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [registro, setRegistro] = useState({ nombre: "", usuario: "", clave: "" });
  const [error, setError] = useState("");
  const [erroresRegistro, setErroresRegistro] = useState({});

  useEffect(() => {
    if (sesion?.tipo === "cliente") navigate(destino, { replace: true });
    if (sesion?.tipo === "sala" || sesion?.tipo === "administracion") navigate("/inventario", { replace: true });
  }, [sesion, destino, navigate]);

  function entrar(evento) {
    evento.preventDefault();
    if (!ingresarCliente(usuario, clave)) {
      setError("Usuario o clave incorrectos.");
      return;
    }
    setError("");
  }

  function crear(evento) {
    evento.preventDefault();
    const resultado = registrarCliente(registro);
    setErroresRegistro(resultado.errores);
  }

  return (
    <article>
      <section className="rounded-2xl bg-verde p-5 text-papel">
        <p className="font-ui text-sm font-semibold text-caqui">Acceso de clientes</p>
        <h1 className="mt-2 font-titulo text-4xl font-semibold">Ingresar</h1>
        <p className="mt-3 max-w-2xl font-texto text-lg">
          Entra para comprar en una sala. Si todavía no tienes cuenta, puedes crearla en esta misma pantalla.
        </p>
      </section>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <form className="rounded-2xl border border-caqui bg-papel p-5" onSubmit={entrar} noValidate>
          <h2 className="font-titulo text-2xl font-semibold">Iniciar sesión</h2>
          <Campo id="cliente-usuario" etiqueta="Usuario" value={usuario} onChange={setUsuario} autoComplete="username" error={error} />
          <Campo id="cliente-clave" etiqueta="Clave" type="password" value={clave} onChange={setClave} autoComplete="current-password" />
          <Boton type="submit" className="mt-4">Entrar</Boton>
        </form>
        <form className="rounded-2xl border border-caqui bg-papel p-5" onSubmit={crear} noValidate>
          <h2 className="font-titulo text-2xl font-semibold">Crear cuenta</h2>
          <Campo id="registro-nombre" etiqueta="Nombre" value={registro.nombre} onChange={(valor) => setRegistro((actual) => ({ ...actual, nombre: valor }))} error={erroresRegistro.nombre} />
          <Campo id="registro-usuario" etiqueta="Usuario" value={registro.usuario} onChange={(valor) => setRegistro((actual) => ({ ...actual, usuario: valor }))} error={erroresRegistro.usuario} />
          <Campo id="registro-clave" etiqueta="Clave" type="password" value={registro.clave} onChange={(valor) => setRegistro((actual) => ({ ...actual, clave: valor }))} error={erroresRegistro.clave} />
          <Boton type="submit" className="mt-4">Crear cuenta</Boton>
        </form>
      </div>
      <Boton to="/ingresar-empresa" variante="secundario" className="mt-4">
        Ingreso de administración
      </Boton>
      <TablaCredenciales
        cuentas={[CLIENTE_DEMO]}
        titulo="Cliente de demostración"
        descripcion="Esta cuenta ya está creada. Las cuentas nuevas quedan guardadas en este navegador."
      />
      <Boton to="/" variante="secundario" className="mt-4">
        Volver al supermercado
      </Boton>
    </article>
  );
}

function Campo({ id, etiqueta, value, onChange, error, type = "text", autoComplete }) {
  return (
    <div className="mt-3 grid gap-1">
      <label htmlFor={id} className="font-ui text-sm font-bold">{etiqueta}</label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        onChange={(evento) => onChange(evento.target.value)}
        className="rounded-lg border border-caqui bg-crema px-3 py-2"
      />
      {error ? <p className="text-sm text-[#7d3428]" role="alert">{error}</p> : null}
    </div>
  );
}
