import { estadoStock, porcentajeStock } from "../utils/formato.js";

export default function BarraStock({ stock, objetivo }) {
  const estado = estadoStock(stock);
  const porcentaje = porcentajeStock(stock, objetivo);

  return (
    <div className={`barra barra--${estado.clave}`}>
      <div
        className="barra__pista"
        role="meter"
        aria-valuenow={stock}
        aria-valuemin={0}
        aria-valuemax={Math.max(objetivo, stock)}
        aria-label={`Stock ${estado.etiqueta}`}
      >
        <span style={{ width: `${porcentaje}%` }} />
      </div>
      <span className={`estado estado--${estado.clave}`}>{estado.etiqueta}</span>
    </div>
  );
}
