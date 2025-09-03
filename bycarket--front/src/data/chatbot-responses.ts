interface ChatbotResponses {
  [key: string]: string[];
}

export const chatbotResponses: ChatbotResponses = {
  saludos: [
    "¡Hola! Bienvenido a nuestro marketplace de vehículos. ¿En qué puedo ayudarte?",
    "¡Hola! Estoy aquí para ayudarte con cualquier pregunta sobre nuestros vehículos.",
    "¡Saludos! ¿Qué tipo de vehículo estás buscando hoy?",
  ],

  premium: [
    "Con nuestro plan Premium tendrás acceso a contenido generado por IA, estadísticas avanzadas y publicaciones destacadas.",
    "El plan Premium incluye generación de descripciones con IA, análisis de mercado y mayor visibilidad para tus anuncios.",
    "¿Te interesa conocer los beneficios del plan Premium? Incluye herramientas de IA para optimizar tus publicaciones.",
  ],

  suscripcion: [
    "Ofrecemos diferentes planes de suscripción para adaptarse a tus necesidades como vendedor.",
    "Nuestros planes de suscripción incluyen funciones básicas gratuitas y Premium con IA avanzada.",
    "¿Quieres saber más sobre nuestros planes de suscripción? Tenemos opciones desde básicas hasta Premium.",
  ],

  precios: [
    "Los precios varían según el tipo de vehículo y las características específicas. ¿Qué vehículo te interesa?",
    "Puedes filtrar por rango de precios en nuestra búsqueda avanzada para encontrar vehículos en tu presupuesto.",
    "¿Tienes un presupuesto específico en mente? Puedo ayudarte a encontrar opciones dentro de tu rango.",
  ],

  venta: [
    "Para vender tu vehículo, simplemente crea una cuenta y publica tu anuncio con fotos y descripción.",
    "El proceso de venta es muy sencillo: sube fotos, completa la información y tu anuncio estará activo.",
    "¿Quieres vender tu vehículo? Te guío paso a paso en el proceso de publicación.",
  ],

  compra: [
    "Para comprar, navega por nuestros anuncios, contacta al vendedor y coordina la inspección del vehículo.",
    "Puedes usar nuestros filtros de búsqueda para encontrar exactamente lo que buscas y contactar directamente al vendedor.",
    "¿Buscas comprar un vehículo específico? Puedo ayudarte a encontrar las mejores opciones disponibles.",
  ],

  contacto: [
    "Puedes contactar directamente a los vendedores a través de los anuncios o escribirnos para soporte técnico.",
    "Para contactar vendedores, usa el botón 'Contactar' en cada anuncio. Para soporte, estamos aquí para ayudarte.",
    "¿Necesitas contactar a alguien específico? Te ayudo a encontrar la mejor forma de comunicarte.",
  ],

  ayuda: [
    "Estoy aquí para ayudarte con cualquier pregunta sobre compra, venta o uso de la plataforma.",
    "¿En qué específicamente necesitas ayuda? Puedo guiarte en compras, ventas o funciones de la plataforma.",
    "Dime qué necesitas y te ayudo a resolverlo de la mejor manera.",
  ],

  ia: [
    "Nuestra IA genera descripciones automáticas, analiza precios de mercado y optimiza tus anuncios.",
    "Con IA Premium puedes generar contenido atractivo para tus anuncios y obtener insights del mercado.",
    "¿Te interesa usar IA para mejorar tus anuncios? Es una función exclusiva de nuestro plan Premium.",
  ],

  default: [
    "Gracias por tu consulta. Un especialista te contactará pronto para brindarte información detallada.",
    "Entiendo tu consulta. Para darte la mejor respuesta, te conectaré con nuestro equipo especializado.",
    "Tu pregunta es importante para nosotros. Te ayudaremos a resolverla de la mejor manera posible.",
    "Gracias por escribirnos. Estamos procesando tu consulta para darte la información más precisa.",
  ],
};

export function getResponseFromDictionary(userMessage: string): string {
  const message = userMessage.toLowerCase();

  const keywords = {
    saludos: [
      "hola",
      "buenos dias",
      "buenas tardes",
      "buenas noches",
      "saludos",
      "hey",
    ],
    premium: [
      "premium",
      "plan premium",
      "premium plan",
      "subscripcion premium",
    ],
    suscripcion: [
      "suscripcion",
      "plan",
      "planes",
      "subscription",
      "pago",
      "mensual",
    ],
    precios: [
      "precio",
      "costo",
      "cuanto cuesta",
      "valor",
      "presupuesto",
      "dinero",
    ],
    venta: ["vender", "venta", "publicar", "anuncio", "anunciar"],
    compra: ["comprar", "compra", "busco", "necesito", "quiero comprar"],
    contacto: ["contacto", "contactar", "telefono", "email", "comunicar"],
    ayuda: ["ayuda", "ayudame", "auxilio", "soporte", "asistencia"],
    ia: [
      "ia",
      "inteligencia artificial",
      "ai",
      "automatico",
      "generar contenido",
    ],
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((keyword) => message.includes(keyword))) {
      const responses = chatbotResponses[category];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  const defaultResponses = chatbotResponses.default;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
