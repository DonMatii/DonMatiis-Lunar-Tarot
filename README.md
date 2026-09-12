<div align="center">

# 🌙✨ DonMatii's Lunar Tarot

<p align="center">
  <b>Plataforma web mística, profesional y de alta conversión desarrollada por <a href="https://github.com/DonMatii">Matías Suazo</a> bajo el sello de ingeniería <code style="color: #9d4edd;">8 Digital</code>.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20Producci%C3%B3n-success?style=for-the-badge&logo=vercel" alt="Status" />
  <img src="https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS%20(ESM)-purple?style=for-the-badge&logo=javascript" alt="Tech" />
  <img src="https://img.shields.io/badge/Backend-Supabase%20Cloud-blue?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge&logo=pwa" alt="PWA" />
</p>

[🌐 **Ver Sitio en Producción (Vercel)**](https://donmatiis-lunar-tarot.vercel.app/)

</div>

---

## 🔮 Sobre el Proyecto

**DonMatii's Lunar Tarot** es un proyecto web moderno desarrollado por **Matías Suazo** para ofrecer un espacio seguro, místico y profesional de orientación espiritual. 

Diseñado con un enfoque de **alta conversión de clientes**, el sitio no solo transmite una estética refinada inspirada en la energía lunar, sino que guía de forma fluida y sin fricciones al consultante desde la exploración de los arcanos hasta el agendamiento directo y personalizado por **WhatsApp**.

---

## ✨ Características Principales

### 🌌 1. Mini-Oráculo Diario Interactivo
- **Baraja Completa:** Integración de los 78 arcanos (Mayores y Menores) con animación 3D de volteo y selección aleatoria (al derecho o invertida).
- **Restricción Diaria Inteligente:** Control por fechas mediante `localStorage` para garantizar una única consulta genuina por día.
- **Efecto Sensorial y Tipeo:** Sonido ambiental de campanillas místicas (con botón de silencio/activación) y mensajes de cierre con efecto de máquina de escribir (*typewriter*).

### 📱 2. Agendamiento Rápido hacia WhatsApp (UX Optimizada)
- **Modal Profesional con Chips de Temáticas:** Botones rápidos interactivos para seleccionar el área de vida de consulta (*Amor y Pareja*, *Trabajo y Dinero*, *Crecimiento Personal*).
- **Mensaje Automatizado:** Redirección directa a WhatsApp con una plantilla formal pre-escrita, lista para coordinar disponibilidad y pagos con cero fricción.

### 🌟 3. Testimonios en Tiempo Real (Supabase Cloud)
- **Base de Datos Cloud:** Conectado a **Supabase (PostgreSQL)** para recibir valoraciones de 1 a 5 estrellas y reseñas reales.
- **Privacidad y Filtros:** Enmascaramiento seguro de correos electrónicos y sistema de filtrado interactivo por estrellas para los visitantes.

### ⚡ 4. Experiencia Progresiva (PWA & Accesibilidad)
- **Modo Instalable (PWA):** Configurado con `manifest.json` y Service Worker (`sw.js`) para funcionar offline e instalarse como app nativa en dispositivos móviles.
- **Control de Accesibilidad:** Botón flotante para alternar tamaños de texto con persistencia local.

---

## 🛠️ Tecnologías y Arquitectura Modular

El proyecto evita dependencias innecesarias de frameworks pesados, apostando por una arquitectura estática modular de alto rendimiento:

| Capa | Tecnologías / Estructura |
| :--- | :--- |
| **Estructura** | HTML5 Semántico (Accesible, SEO optimizado y Open Graph) |
| **Estilos** | CSS3 Modular por dominios funcionales (`variables.css`, `base.css`, `animations.css`, `navigation.css`, `cards.css`, `modals.css`, `hero.css`, `oraculo.css`, `forms.css`, `footer.css`) |
| **Lógica Frontend** | JavaScript Moderno (ES Modules: `main.js`, `tarotData.js`, `tarotLogic.js`, `testimonials.js`, `modalBooking.js`, `accessibility.js`, `pwa.js`) |
| **Base de Datos / Cloud** | **Supabase JS Client** (`supabaseClient.js`) para gestión de testimonios en la nube |
| **Rendimiento** | Activos en nomenclatura *kebab-case*, imágenes comprimidas en **WebP** y tipografías *Cinzel* & *Plus Jakarta Sans* |

---

## 📂 Estructura del Repositorio

```text
DonMatiis-Lunar-Tarot/
├── IMG/                    # Imágenes optimizadas en WebP
├── assets/
│   ├── audio/              # Efectos de sonido (Campanillas)
│   ├── css/                # Estilos modulares desacoplados
│   └── js/                 # Módulos de lógica ES6 (incl. supabaseClient.js)
├── .gitignore              # Archivos excluidos del control de versiones
├── index.html              # Página principal monolítica modular
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker para caché y offline
└── README.md               # Documentación oficial del proyecto
```

---

## 🚀 Despliegue e Infraestructura

- **Hosting & CDN:** Desplegado de forma continua en **Vercel** mediante integración directa con GitHub.
- **Base de Datos:** PostgreSQL alojada en la nube mediante **Supabase**.

---

<p align="center">
  <i>Desarrollado con 🌙 por <code style="color: #9d4edd;">8 Digital</code></i>
</p>
