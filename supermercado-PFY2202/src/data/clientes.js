export const CLIENTE_DEMO = {
  id: "cliente-demo",
  tipo: "cliente",
  nombre: "Cliente demostración",
  usuario: "cliente",
  clave: "cliente-PFY2202",
};

export function clientePorId(clientes, id) {
  return clientes.find((cliente) => cliente.id === id) ?? null;
}
