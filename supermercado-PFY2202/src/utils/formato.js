export const UMBRAL_STOCK_BAJO = 10;

export function estadoStock(stock) {
  if (stock <= 0) {
    return { clave: "agotado", etiqueta: "Agotado" };
  }

  if (stock <= UMBRAL_STOCK_BAJO) {
    return { clave: "bajo", etiqueta: "Stock bajo" };
  }

  return { clave: "ok", etiqueta: "Disponible" };
}

export function formatoFecha(valor) {
  return new Date(valor).toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function porcentajeStock(stock, objetivo) {
  if (objetivo <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((stock / objetivo) * 100)));
}

export function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function decodificarSegmento(valor) {
  try {
    return decodeURIComponent(valor);
  } catch {
    return valor;
  }
}

export function slugCategoria(categoria) {
  return normalizar(categoria).replace(/\s+/g, "-");
}
