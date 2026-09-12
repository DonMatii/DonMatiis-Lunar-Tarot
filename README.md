<div align="center">

# 🌙 DonMatii's Lunar Tarot

### Lecturas de Tarot, Péndulo y Cartomancia

Plataforma web mística, profesional y de alta conversión para consultas espirituales en línea.

Desarrollada por <a href="https://github.com/DonMatii">**Matías Suazo**</a> bajo el sello de ingeniería <code style="color: #9d4edd;">**8 Digital**</code>.

<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20Producci%C3%B3n-00c853?style=for-the-badge&logo=vercel&logoColor=white" alt="Status" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-success?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Supabase-Cloud-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PWA-Instalable-ff6f00?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
</p>

<p align="center">
  <a href="https://donmatiis-lunar-tarot.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Ver_Sitio_en_Producción-7c3aed?style=for-the-badge&labelColor=1a1a2e" alt="Ver sitio en producción" />
  </a>
</p>

</div>

---

## 🔮 Sobre el Proyecto

**DonMatii's Lunar Tarot** es una plataforma web moderna diseñada para ofrecer un espacio seguro, místico y profesional de orientación espiritual. Cada detalle está pensado con un enfoque de **alta conversión de clientes**: desde la estética lunar hasta el agendamiento directo por **WhatsApp** sin fricciones.

> *"Mi misión es entregarte un espacio seguro, libre de juzios y lleno de luz para ayudarte a descifrar los mensajes que el universo tiene preparados para ti."* — Matías Suazo

---

## ✨ Características

### 🌌 Mini-Oráculo Diario
- **78 arcanos** (Mayores y Menores) con animación 3D de volteo
- Selección aleatoria: al derecho o **invertida** (carta cruzada)
- Restricción de **una consulta diaria** por visitante
- Sonido ambiental de campanillas místicas (con control de silencio)
- Mensajes de cierre con efecto **typewriter**
- **Lazy loading** de datos de arcanos (solo se cargan al consultar)

### 📱 Agendamiento por WhatsApp
- Modal profesional con **chips de temáticas** interactivos:
  - 💜 Amor y Pareja
  - 💰 Trabajo y Dinero
  - 🌿 Crecimiento Personal
- Mensaje automatizado pre-escrito con un clic
- Cero fricción: del oráculo a la consulta en segundos

### 🌟 Testimonios en Tiempo Real
- Base de datos **Supabase (PostgreSQL)** en la nube
- Políticas **RLS** (Row Level Security) para seguridad
- Los testimonios se publican **inmediatamente** al enviarlos — transparencia total
- Filtrado interactivo por valoración (1–5 estrellas)
- Enmascaramiento automático de correos electrónicos por privacidad

### ⚡ PWA & Rendimiento
- **Modo instalable** como app nativa en dispositivos móviles
- Service Worker v4 con **cache-on-demand** para estáticos
- **Notificación de actualización** — toast "Hay una nueva versión" con recarga automática
- **Página offline** — fallback temático cuando no hay conexión a internet
- **Toast de bienvenida** — detecta plataforma (iOS/Android) y muestra instrucciones de instalación
- **Manifest maskable** — ícono se adapta correctamente en Android (recorte circular)
- **CSS concatenado** — 1 request en vez de 10 para el critical path
- **Preload de fuentes críticas** — Cinzel + Plus Jakarta Sans precargadas
- **Skeleton loading** en oráculo — placeholder animado mientras carga la carta
- **Lazy loading** de imágenes below-the-fold
- **Preconnect** a Supabase para carga más rápida
- **Font Awesome** cacheado por SW (~90KB una sola vez)

### 🔍 SEO & Analytics
- **JSON-LD** estructurado (FAQPage + ProfessionalService) para rich snippets
- **Meta description** y **canonical URL** optimizados
- **Open Graph** completo (`og:locale`, `og:site_name`) + Twitter Card
- **robots.txt** + **sitemap.xml** para crawlers
- **Google Tag Manager** (GTM-NZSNV7HN) con event tracking:
  - Clicks en CTA WhatsApp (hero, oráculo, modal, cta-final)
  - Click en botón flotante de WhatsApp
  - Revelación del oráculo diario
  - Selección de temas en chips de servicios

### ♿ Accesibilidad (WCAG)
- **Skip-to-content** para navegación por teclado
- **ARIA completo**: `role="dialog"`, `aria-modal`, `aria-live`, `aria-expanded`, `aria-pressed`, `role="radiogroup"`
- **FAQ colapsables** con `<details>/<summary>` nativos (funcionan sin JS)
- **Star rating** semántico con `role="radio"` y `aria-checked`
- **`prefers-reduced-motion`** — animaciones se desactivan automáticamente
- **Botón "volver arriba"** — aparece al hacer scroll, accesible con teclado
- **Counter animado** en "Sobre Mí" — números (+500, 100%, 24h) se animan al hacer scroll
- Botón flotante para alternar tamaños de texto (persistencia local)
- Completamente **responsive**: escritorio, tablet y móvil

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Estructura** | HTML5 Semántico (SEO + Open Graph + JSON-LD) |
| **Estilos** | CSS3 Concatenado (10 módulos → 1 archivo) |
| **Lógica** | JavaScript Moderno (ES Modules, lazy loading) |
| **Base de Datos** | Supabase Cloud (PostgreSQL + RLS) |
| **Analytics** | Google Tag Manager (GTM-NZSNV7HN) |
| **Despliegue** | Vercel (deploy automático desde GitHub) |
| **Rendimiento** | WebP, lazy loading, preconnect, cache-on-demand, offline fallback |

---

## 📂 Estructura del Repositorio

```text
DonMatiis-Lunar-Tarot/
├── IMG/                         # Imágenes optimizadas en WebP
│   ├── Logo-3.webp              # Logo principal (favicon + nav + footer)
│   ├── Logo-0/1/2.webp          # Variantes del logo
│   └── Foto-Matias-Suazo.webp   # Foto personal (sección Sobre Mí)
├── assets/
│   ├── audio/                   # Efectos de sonido (campanillas)
│   ├── css/
│   │   ├── style.css            # CSS concatenado (10 módulos en 1 archivo)
│   │   ├── variables.css        # Paleta de colores (dev)
│   │   ├── base.css             # Reset y tipografía (dev)
│   │   ├── animations.css       # Transiciones y keyframes (dev)
│   │   ├── navigation.css       # Header y menú (dev)
│   │   ├── hero.css             # Sección principal (dev)
│   │   ├── cards.css            # Tarjetas de servicios (dev)
│   │   ├── oraculo.css          # Mini-oráculo interactivo (dev)
│   │   ├── modals.css           # Modal de agendamiento (dev)
│   │   ├── forms.css            # Formulario + botones (dev)
│   │   └── footer.css           # Pie de página + FAQ (dev)
│   └── js/                      # Módulos de lógica (8 archivos)
│       ├── main.js              # Coordinador + menú + scroll-to-top + event tracking + counters
│       ├── tarotData.js         # Datos de los 78 arcanos (lazy)
│       ├── tarotLogic.js        # Lógica del oráculo
│       ├── testimonials.js      # CRUD de testimonios (Supabase)
│       ├── supabaseClient.js    # Cliente Supabase (conexión)
│       ├── modalBooking.js      # Modal + chips + WhatsApp
│       ├── accessibility.js     # Control de tamaño de texto
│       └── pwa.js               # SW + update toast + welcome toast
├── .gitignore                   # Archivos excluidos del repo
├── index.html                   # Página principal (SPA monolítica)
├── offline.html                 # Fallback offline (temático)
├── manifest.json                # Configuración PWA (maskable)
├── robots.txt                   # Instrucciones para crawlers
├── sitemap.xml                  # Mapa del sitio para buscadores
├── sw.js                        # Service Worker v4 (offline + update detection)
└── README.md                    # Esta documentación
```

---

## 🔒 Seguridad y Datos

| Aspecto | Implementación |
| :--- | :--- |
| **Autenticación** | API key pública (anon) de Supabase — sin login de usuarios |
| **RLS habilitado** | Lectura pública de todos los testimonios. Inserción pública controlada. |
| **Privacidad** | Correos electrónicos enmascarados en la UI (ej: `ca****@****.cl`) |
| **Service Worker** | Llamadas a Supabase van siempre a la red (nunca se cachean) |
| **Transparencia** | Testimonios publicados inmediatamente — sin censura ni moderación |

---

## 🚀 Despliegue

- **Hosting:** [Vercel](https://vercel.com/) — deploy automático al hacer `push` a `main`
- **CDN:** Assets servidos desde la edge de Vercel
- **Base de datos:** [Supabase](https://supabase.com/) — PostgreSQL en la nube (región US West)
- **CI/CD:** Integración directa con GitHub (sin configuración adicional)

---

## 👨‍💻 Autor

**Matías Suazo** — Lector de tarot, péndulo y cartomancia

<a href="https://github.com/DonMatii" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-DonMatii-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
<a href="https://www.tiktok.com/@donmatii8" target="_blank">
  <img src="https://img.shields.io/badge/TikTok-@donmatii8-000000?style=for-the-badge&logo=tiktok&logoColor=white" alt="TikTok" />
</a>

---

<div align="center">

Desarrollado con 🌙 por <a href="https://8-digital.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: #9d4edd;">**8 Digital**</a>

</div>
