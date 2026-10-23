export const CONSULTAS_INICIALES = [
  {
    id: "detergente-pintana",
    de: "san-bernardo",
    para: "la-pintana",
    asunto: "Detergente líquido agotado",
    creada: "2026-10-22T14:30:00.000Z",
    mensajes: [
      {
        id: "msg-detergente-1",
        autor: "san-bernardo",
        texto: "En San Bernardo el detergente líquido 3 L está en cero. ¿Tienen unidades para un traspaso hoy?",
        fecha: "2026-10-22T14:30:00.000Z",
      },
      {
        id: "msg-detergente-2",
        autor: "la-pintana",
        texto: "Tenemos 6 unidades en sala. Podemos apartar 4 si las retiran antes de las 18:00.",
        fecha: "2026-10-22T15:10:00.000Z",
      },
    ],
    resueltaPor: {
      "san-bernardo": false,
      "la-pintana": false,
    },
  },
  {
    id: "turno-puente",
    de: "puente-alto",
    para: "administracion",
    asunto: "Cambio de turno del domingo",
    creada: "2026-10-21T11:05:00.000Z",
    mensajes: [
      {
        id: "msg-turno-1",
        autor: "puente-alto",
        texto: "Necesitamos confirmar si el domingo 26 abre la sala con el turno corto de feria.",
        fecha: "2026-10-21T11:05:00.000Z",
      },
    ],
    resueltaPor: {
      "puente-alto": true,
      administracion: false,
    },
  },
  {
    id: "palta-cerrada",
    de: "la-pintana",
    para: "puente-alto",
    asunto: "Traspaso de palta Hass",
    creada: "2026-10-18T09:20:00.000Z",
    mensajes: [
      {
        id: "msg-palta-1",
        autor: "la-pintana",
        texto: "Nos sobran 8 mallas de palta Hass. ¿Las reciben en Puente Alto?",
        fecha: "2026-10-18T09:20:00.000Z",
      },
      {
        id: "msg-palta-2",
        autor: "puente-alto",
        texto: "Sí. Llegaron a las 16:40 y ya están en el pasillo 2.",
        fecha: "2026-10-18T16:45:00.000Z",
      },
    ],
    resueltaPor: {
      "la-pintana": true,
      "puente-alto": true,
    },
  },
];
