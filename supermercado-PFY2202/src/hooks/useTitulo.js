import { useEffect } from "react";

export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = `${titulo} | Supermercado PFY2202`;
  }, [titulo]);
}
