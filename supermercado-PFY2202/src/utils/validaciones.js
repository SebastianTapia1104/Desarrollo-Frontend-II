const TEXTO = /^[\p{L}\p{N}][\p{L}\p{N}\s.'()-]*$/u;
const USUARIO = /^[a-z0-9]{3,20}$/;
const CLAVE = /^[A-Za-z0-9-]{6,40}$/;

function limpiar(valor) {
  return String(valor ?? "").trim();
}

function validarTexto(valor, etiqueta) {
  const limpio = limpiar(valor);
  if (limpio.length < 2 || !TEXTO.test(limpio)) {
    return `${etiqueta} debe tener al menos 2 caracteres y usar letras o números.`;
  }
  return "";
}

export function validarNombre(valor) {
  return validarTexto(valor, "El nombre");
}

export function validarMarca(valor) {
  return validarTexto(valor, "La marca");
}

export function validarTipo(valor) {
  return validarTexto(valor, "El tipo");
}

export function validarPrecio(valor) {
  if (valor === "" || valor === null || valor === undefined) {
    return "El precio debe ser un número igual o mayor a 0.";
  }
  const numero = Number(valor);
  if (!Number.isFinite(numero) || numero < 0) {
    return "El precio debe ser un número igual o mayor a 0.";
  }
  return "";
}

export function validarStock(valor) {
  if (!/^\d+$/.test(limpiar(valor))) {
    return "El stock debe ser un número entero entre 0 y 999.";
  }
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero > 999) {
    return "El stock debe ser un número entero entre 0 y 999.";
  }
  return "";
}

export function validarArticulo(datos) {
  const errores = {
    nombre: validarNombre(datos.nombre),
    marca: validarMarca(datos.marca),
    tipo: validarTipo(datos.tipo),
    precio: validarPrecio(datos.precio),
    stock: validarStock(datos.stock),
  };
  const presentes = Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje));
  if (Object.keys(presentes).length > 0) {
    return { ok: false, errores: presentes, datos: null };
  }
  return {
    ok: true,
    errores: {},
    datos: {
      nombre: limpiar(datos.nombre),
      marca: limpiar(datos.marca),
      tipo: limpiar(datos.tipo),
      precio: Math.round(Number(datos.precio)),
      stock: Number(datos.stock),
      pasillo: limpiar(datos.pasillo) || "1",
    },
  };
}

export function validarAsunto(valor) {
  if (limpiar(valor).length < 3) return "Escribe un asunto de al menos 3 caracteres.";
  return "";
}

export function validarMensaje(valor) {
  if (limpiar(valor).length < 10) return "El mensaje debe tener al menos 10 caracteres.";
  return "";
}

export function validarRespuesta(valor) {
  if (limpiar(valor).length < 2) return "Escribe una respuesta de al menos 2 caracteres.";
  return "";
}

export function validarUsuario(valor) {
  const limpio = limpiar(valor).toLowerCase();
  if (!USUARIO.test(limpio)) {
    return "El usuario debe tener entre 3 y 20 letras o números, sin espacios.";
  }
  return "";
}

export function validarClave(valor) {
  if (!CLAVE.test(String(valor ?? ""))) {
    return "La clave debe tener entre 6 y 40 letras, números o guiones.";
  }
  return "";
}

export function validarConsulta({ para, asunto, mensaje }) {
  const errores = {};
  if (!para) errores.para = "Elige a quién va dirigida.";
  const asuntoError = validarAsunto(asunto);
  const mensajeError = validarMensaje(mensaje);
  if (asuntoError) errores.asunto = asuntoError;
  if (mensajeError) errores.mensaje = mensajeError;
  return errores;
}

export function validarRegistro({ nombre, usuario, clave }) {
  const errores = {};
  const nombreError = validarNombre(nombre);
  const usuarioError = validarUsuario(usuario);
  const claveError = validarClave(clave);
  if (nombreError) errores.nombre = nombreError;
  if (usuarioError) errores.usuario = usuarioError;
  if (claveError) errores.clave = claveError;
  return errores;
}
