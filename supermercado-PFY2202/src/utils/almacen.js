export function guardarLocal(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function quitarLocal(clave) {
  try {
    localStorage.removeItem(clave);
    return true;
  } catch {
    return false;
  }
}
