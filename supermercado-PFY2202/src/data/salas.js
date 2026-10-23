export const SALAS = [
  {
    id: "san-bernardo",
    tipo: "sala",
    nombre: "San Bernardo",
    direccion: "Av. PFY 2202, San Bernardo",
    horario: "Lunes a sábado, 8:00 a 21:00",
    domingo: "Domingo, 9:00 a 20:00",
    telefono: "+56 2 2345 2202",
    correo: "sanbernardo@supermercadopfy2202.cl",
    usuario: "sanbernardo",
    clave: "sanbernardo-PFY2202",
  },
  {
    id: "la-pintana",
    tipo: "sala",
    nombre: "La Pintana",
    direccion: "Av. Santa Rosa 13440, La Pintana",
    horario: "Lunes a sábado, 8:30 a 21:00",
    domingo: "Domingo, 9:00 a 20:00",
    telefono: "+56 2 2510 1180",
    correo: "lapintana@supermercadopfy2202.cl",
    usuario: "lapintana",
    clave: "lapintana-PFY2202",
  },
  {
    id: "puente-alto",
    tipo: "sala",
    nombre: "Puente Alto",
    direccion: "Av. Concha y Toro 1876, Puente Alto",
    horario: "Lunes a sábado, 8:00 a 21:30",
    domingo: "Domingo, 9:00 a 21:00",
    telefono: "+56 2 2850 4410",
    correo: "puentealto@supermercadopfy2202.cl",
    usuario: "puentealto",
    clave: "puentealto-PFY2202",
  },
];

export const ADMINISTRACION = {
  id: "administracion",
  tipo: "administracion",
  nombre: "Administración",
  direccion: "Av. PFY 2202, San Bernardo",
  horario: "Lunes a viernes, 9:00 a 18:00",
  domingo: "Sábado y domingo, cerrado",
  telefono: "+56 2 2345 2200",
  correo: "administracion@supermercadopfy2202.cl",
  usuario: "administracion",
    clave: "administracion-PFY2202",
};

export const CUENTAS = [...SALAS, ADMINISTRACION];

export function buscarCuenta(usuario, clave) {
  const normalizado = usuario.trim().toLowerCase();
  return CUENTAS.find((cuenta) => cuenta.usuario === normalizado && cuenta.clave === clave) ?? null;
}

export function cuentaPorId(id) {
  return CUENTAS.find((cuenta) => cuenta.id === id) ?? null;
}

export function etiquetaCuenta(id) {
  const cuenta = cuentaPorId(id);
  if (!cuenta) return id;
  if (cuenta.tipo === "administracion") return cuenta.nombre;
  return `Sala ${cuenta.nombre}`;
}

export function destinosDe(cuentaId) {
  if (cuentaId === ADMINISTRACION.id) return SALAS;
  return [...SALAS.filter((sala) => sala.id !== cuentaId), ADMINISTRACION];
}
