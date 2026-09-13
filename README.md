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

> *"Mi misión es entregarte un espacio seguro, libre de juicios y lleno de luz para ayudarte a descifrar los mensajes que el universo tiene preparados para ti."* — Matías Suazo

---

## ✨ Características

### 🌌 Mini-Oráculo Diario
- **78 arcanos** (Mayores y Menores) con animación 3D de volteo
- Selección aleatoria: al derecho o **invertida** (carta cruzada)
- Restricción de **una consulta diaria** por visitante
- Sonido ambiental de campanillas místicas (con control de silencio)
- **Animación de entrada** en elementos del hero con efecto `animate-fade`
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
- **Anti-spam honeypot**: campo oculto que atrapa bots sin afectar usuarios reales

### 🔐 Panel de Administración
- Página oculta en `/admin.html` — no aparece en navegación ni Google
- **Supabase Auth** — login con email + contraseña para administradores
- **Gestión de testimonios** — ver, editar y borrar cualquier testimonio
- **Dashboard** — total de testimonios y promedio de estrellas
- **Responsive** — funciona desde el celular para moderar sobre la marcha
- **Feedback visual** — toast notifications para todas las operaciones

### ⚡ PWA & Rendimiento
- **Modo instalable** como app nativa en dispositivos móviles
- Service Worker v4 con **cache-on-demand** para estáticos + precache solo local
- **Notificación de actualización** — toast "Hay una nueva versión" con recarga automática
- **Página offline** — fallback temático cuando no hay conexión a internet
- **Toast de bienvenida** — detecta plataforma (iOS/Android) y muestra instrucciones de instalación
- **Compartir oráculo** — botón post-revelación para compartir carta del día por WhatsApp o copiar
- **Manifest maskable** — ícono se adapta correctamente en Android (recorte circular)
- **Apple Touch Icon** — ícono PNG para iOS al agregar a pantalla de inicio
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
- **`aria-controls`** correctamente vinculado en hamburger menu
- **ARIA completo**: `role="dialog"`, `aria-modal`, `aria-live`, `aria-expanded`, `aria-pressed`, `role="radiogroup"` con estados correctos
- **FAQ colapsables** con `<details>/<summary>` nativos (funcionan sin JS)
- **Star rating** semántico con `role="radio"` y `aria-checked` dinámico
- **`prefers-reduced-motion`** — animaciones se desactivan automáticamente
- **`:focus-visible`** en todos los botones y elementos interactivos
- **Modal con focus trap** — Tab cicla dentro, Escape cierra, foco se devuelve al trigger
- **Botón "volver arriba"** — aparece al hacer scroll, accesible con teclado
- **Counter animado** en "Sobre Mí" — números se animan al hacer scroll
- **Tooltip WhatsApp** visible con teclado (`:focus-within`) además de hover
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
│   └── Foto-Matias-Suazo.webp   # Foto personal (sección Sobre Mí)
├── assets/
│   ├── audio/                   # Efectos de sonido (campanillas)
│   ├── css/
│   │   ├── variables.css        # Paleta de colores y tokens de diseño
│   │   ├── base.css             # Reset, tipografía y estilos globales
│   │   ├── animations.css       # Transiciones y keyframes
│   │   ├── navigation.css       # Header y menú responsive
│   │   ├── hero.css             # Sección principal (oráculo hero)
│   │   ├── cards.css            # Tarjetas de servicios y lecturas
│   │   ├── oraculo.css          # Mini-oráculo interactivo + compartir
│   │   ├── modals.css           # Modal de agendamiento
│   │   ├── forms.css            # Formulario + botones
│   │   ├── footer.css           # Pie de página + FAQ
│   │   ├── toasts.css           # Notificaciones toast (SW update + welcome)
│   │   ├── accessibility.css    # Focus-visible + controles de accesibilidad
│   │   ├── scroll-top.css       # Botón scroll-to-top
│   │   ├── skeleton.css         # Skeleton loading del oráculo
│   │   └── admin.css            # CSS exclusivo del panel de administración
│   └── js/                      # Módulos de lógica (9 archivos)
│       ├── main.js              # Coordinador + menú + scroll-to-top + event tracking + counters
│       ├── tarotData.js         # Datos de los 78 arcanos (lazy)
│       ├── tarotLogic.js        # Lógica del oráculo
│       ├── testimonials.js      # CRUD de testimonios (Supabase)
│       ├── supabaseClient.js    # Cliente Supabase (conexión)
│       ├── modalBooking.js      # Modal + chips + WhatsApp
│       ├── accessibility.js     # Control de tamaño de texto
│       ├── pwa.js               # SW + update toast + welcome toast
│       └── admin.js             # Panel admin — autenticación + gestión de testimonios
├── .gitignore                   # Archivos excluidos del repo
├── admin.html                   # Panel de administración (oculto — no indexado)
├── index.html                   # Página principal (SPA monolítica)
├── offline.html                 # Fallback offline (temático)
├── manifest.json                # Configuración PWA (maskable)
├── robots.txt                   # Instrucciones para crawlers (bloquea /admin.html)
├── sitemap.xml                  # Mapa del sitio para buscadores
├── sw.js                        # Service Worker v4 (offline + update detection)
└── README.md                    # Esta documentación
```

---

## 🔒 Seguridad y Datos

| Aspecto | Implementación |
| :--- | :--- |
| **Autenticación** | API key pública (anon) de Supabase — sin login de usuarios públicos |
| **RLS habilitado** | Lectura pública de todos los testimonios. Inserción pública controlada. |
| **Privacidad** | Correos electrónicos enmascarados en la UI + no se transfieren al cliente |
| **Service Worker** | Llamadas a Supabase van siempre a la red (nunca se cachean) + fallback 503 |
| **Transparencia** | Testimonios publicados inmediatamente — sin censura ni moderación |
| **Admin oculto** | Panel en `/admin.html` — bloqueado en `robots.txt`, sin links públicos |
| **Admin auth** | Supabase Auth con email + contraseña — solo administradores autorizados |
| **Admin RLS** | Solo usuarios autenticados pueden modificar testimonios |

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

## 📝 Cambios Recientes

### v1.3 — Agosto 2026
- **CSS modularizado**: eliminado `style.css` (1801 líneas) → 14 archivos modulares por responsabilidad (estándar de industria)
- **Bug fixes**: corregido typo "plans" → "planes" en carta de tarot, puntuación en texto del oráculo
- **Badge de posición con color**: "Al Derecho" en verde, "Invertida" en morado — distinción visual clara
- **Accesibilidad estrellas**: flechas del teclado ←→ para navegar entre opciones de valoración (WCAG)
- **Código limpio**: eliminado `console.log` en producción, quitado inline style del botón de audio
- **Admin optimizado**: CSS separado en `admin.css` (reduce carga en ~95%), cliente Supabase consolidado
- **OG Image PNG**: imagen de Open Graph cambiada de WebP a PNG para mejor compatibilidad

### v1.2 — Agosto 2026
- **Panel de administración**: página oculta en `/admin.html` con login Supabase Auth
- **Gestión de testimonios**: ver, editar y borrar testimonios desde el panel admin
- **Dashboard**: total de testimonios y promedio de estrellas en tiempo real
- **robots.txt actualizado**: `/admin.html` bloqueado para buscadores
- **Accesibilidad**: star rating `aria-checked` corregido, Escape cierra menú móvil
- **UX mejorada**: scroll bloqueado cuando menú móvil está abierto
- **Admin - Diseño místico**: estrellas decorativas, gradientes, glow effects, animación flotante en luna
- **Admin - Favicon**: ícono de luna visible en la pestaña del navegador
- **Admin - Toast notifications**: feedback visual para todas las operaciones (guardar, borrar, error)
- **Admin - Responsive**: panel funciona desde el celular para moderar sobre la marcha

### v1.1 — Agosto 2026
- **Hamburger menu mejorado**: reemplazado ícono FontAwesome por diseño CSS puro de tres líneas con animación a X al abrir el menú
- **Testimonios — email en query**: corregido SELECT de Supabase para incluir campo `email` y mostrar enmascaramiento correcto
- **Español neutro**: eliminados modismos argentinos ("pincha aquí" → "haz clic aquí", "Podés" → "Puedes")
- **Service Worker v4**: precache solo de archivos locales, sin CDN externos
- **Página offline temática**: fallback con estética mística cuando no hay conexión
- **Welcome toast PWA**: detecta plataforma iOS/Android y muestra instrucciones de instalación
- **Compartir oráculo**: botón post-revelación para compartir carta del día por WhatsApp o copiar
- **Apple Touch Icon**: ícono PNG para iOS
- **Google Tag Manager**: event tracking en clicks WhatsApp, revelación oráculo, selección de temas
- **Anti-spam honeypot**: campo oculto en formulario de testimonios que atrapa bots sin afectar usuarios reales
- **Animación hero**: elementos del hero ahora tienen entrada animada con `animate-fade`
- **Tooltip WhatsApp accesible**: tooltip visible con teclado (`:focus-within`) además de hover
- **Grids responsivos**: `minmax` ajustado para evitar overflow en pantallas menores a 340px
- **Logos limpiados**: eliminados Logo-0, Logo-1, Logo-2 no utilizados (ahorra ~500KB en el repo)
- **.gitignore actualizado**: agregado `dist/` para builds

---

<div align="center">

Desarrollado con 🌙 por <a href="https://8-digital.vercel.app/" target="_blank" rel="noopener noreferrer" style="color: #9d4edd;">**8 Digital**</a>

</div>
