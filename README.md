# DonMatii's Lunar Tarot 🌙✨

Página web mística, profesional y optimizada para la promoción de lecturas espirituales de **Tarot, Péndulo y Cartomancia** guiadas por **Matías Suazo**.

## ✨ Características Principales
- **Diseño Místico y Elegante:** Paleta de colores en tonos morados, lilas profundos y acentos dorados inspirados en la energía lunar y la claridad espiritual.
- **Secciones Integradas:**
  - **Portada (Hero):** Logo principal (`Logo-3.webp`) destacado en formato WebP de alta velocidad, bienvenida cálida, enlace gancho interactivo hacia los arcanos y botones de llamada a la acción (CTA).
  - **Mini-Oráculo Diario:** Baraja completa de los 78 arcanos (Mayores y Menores) con animación 3D de volteo, selección aleatoria de carta al derecho o invertida, descripciones místicas profundas de alto nivel profesional, **sistema de bloqueo diario por fecha (`localStorage`)** para garantizar una única consulta genuina por día, **efecto de sonido ambiental de campanillas místicas al revelar la carta** (con su respectivo botón interactivo para silenciar/activar el sonido a gusto del usuario) y un mensaje de cierre interactivo con efecto de máquina de escribir (*typewriter*) que invita a volver al día siguiente o agendar una lectura.
  - **Catálogo de Lecturas:** Desglose detallado de los servicios de Tarot, Péndulo y Cartomancia con llamadas a la acción optimizadas (*"Resolvamos tus dudas"*), complementados con sutiles invitaciones empáticas.
  - **Cómo Funciona:** Guía visual paso a paso para orientar a los nuevos consultantes de forma simple y transparente.
  - **Sobre Mí:** Presentación personal de Matías Suazo, lector especializado, destacando el compromiso con la confidencialidad.
  - **Preguntas Frecuentes:** Resolución de dudas comunes sobre modalidad, pagos y preparación.
  - **Testimonios:** Sistema interactivo de reseñas con valoración de 1 a 5 estrellas, validación de correo, enmascaramiento seguro por privacidad y **filtro interactivo completo de 1 a 5 estrellas** para organizar y transparentar las experiencias de los consultantes.
- **Interactividad y Canales de Contacto:**
  - **Modal de Agendamiento Profesional:** Ventana emergente interactiva al solicitar una lectura, equipada con validación estricta en tiempo real (nombres de 2 a 50 caracteres sin símbolos, selectores obligatorios e inquietudes estructuradas de 15 a 250 caracteres), alertas personalizadas al estilo de DonMatii y generación automática de mensajes formales listos para enviar a WhatsApp.
  - **Botón de Agendamiento Superior:** Acceso directo en la barra de navegación para agendar lecturas al instante.
  - **Botón Flotante de WhatsApp:** Chat directo equipado con un *tooltip* interactivo y animado al pasar el cursor.
  - **Botón Flotante de Accesibilidad:** Control interactivo en la esquina inferior izquierda para alternar dinámicamente entre tamaño de texto normal y grande mejorado (escala optimizada para mayor legibilidad y confort visual), con persistencia en almacenamiento local (`localStorage`).
  - **Enlace a TikTok:** Conexión directa con la comunidad (`@donmatii8`).
  - **Optimización Social (Open Graph):** Metadatos configurados con rutas absolutas limpias y estandarizadas en formato *kebab-case* para generar tarjetas de previsualización profesionales y veloces en WhatsApp y redes sociales.
  - **Capacidad PWA (Progressive Web App):** Integración completa con manifiesto (`manifest.json`) y Service Worker (`sw.js`) para permitir la instalación de la aplicación directamente en la pantalla de inicio de dispositivos móviles y asegurar funcionamiento offline.
  - **Diseño Responsivo:** Adaptabilidad total en celulares, tablets y computadores.
  - **Animaciones al Scroll:** Efectos visuales de aparición dinámica construidos mediante ES Modules y observadores de intersección.

## 🛠️ Tecnologías y Arquitectura Modular
- **HTML5 Semántico**
- **CSS3 Modular:** Arquitectura de estilos desacoplada y limpia organizada por dominios funcionales (*variables.css*, *base.css*, *animations.css*, *navigation.css*, *cards.css*, *modals.css*, *hero.css*, *oraculo.css*, *forms.css*, *footer.css*), empleando variables personalizadas, Grid, Flexbox, perspectiva 3D, scroll personalizado, modales interactivos y transiciones suaves.
- **JavaScript Moderno (ES Modules):** Código desacoplado en componentes especializados (`main.js`, `tarotData.js`, `tarotLogic.js`, `testimonials.js`, `modalBooking.js`, `accessibility.js`, `pwa.js`) para el manejo eficiente del menú móvil, almacenamiento local persistente (accesibilidad y restricción diaria del oráculo), registro y control de Service Worker, baraja completa de 78 arcanos, efectos de sonido multimedia con control de mute, tipeo progresivo, validaciones estrictas y observadores de intersección.
- **Arquitectura PWA:** `manifest.json` y `sw.js` (Service Worker) para gestión avanzada de caché y experiencia nativa en dispositivos móviles.
- **Optimización de Rendimiento:** Estructura de activos estandarizada en nomenclatura **kebab-case** (guiones medios), imágenes procesadas en formato moderno **WebP** y recursos multimedia optimizados para garantizar una carga ultrarrápida.
- **Librerías externas:** FontAwesome (iconos) y Google Fonts (Cinzel y Plus Jakarta Sans).

---
*Desarrollado con dedicación para guiar y conectar a través de los arcanos.* 🔮