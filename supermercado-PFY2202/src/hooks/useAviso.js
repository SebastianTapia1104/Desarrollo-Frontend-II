import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function useAviso() {
  const location = useLocation();
  const desdeRuta = location.state?.aviso ?? "";
  const [local, setLocal] = useState("");
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    setOculto(false);
  }, [desdeRuta]);

  const texto = oculto ? "" : local || desdeRuta;

  function mostrar(mensaje) {
    setLocal(mensaje);
    setOculto(false);
  }

  function cerrar() {
    setLocal("");
    setOculto(true);
  }

  return { texto, mostrar, cerrar };
}
