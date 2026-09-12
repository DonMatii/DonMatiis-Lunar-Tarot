const CACHE_NAME = 'lunar-tarot-v4';

// Archivos críticos para la primera carga
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/IMG/Logo-3.webp',
  '/assets/css/style.css',
  '/assets/js/main.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap'
];

// Dominios de API que NUNCA se cachean (siempre ir a la red)
const API_HOSTS = ['ynzcxucugrzlitremtus.supabase.co'];

// Instalación: pre-cache de archivos críticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
});

// Activación: limpiar cachés antiguas y tomar control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Escuchar SKIP_WAITING del cliente para activar nueva versión
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estrategia de fetch:
// - API (Supabase): SIEMPRE red (nunca cachear)
// - Navegación (HTML): network-first, fallback a offline.html
// - Estáticos: cache-first, network fallback (se cachean on-demand)
self.addEventListener('fetch', event => {
  const { hostname } = new URL(event.request.url);

  // Supabase API → siempre red
  if (API_HOSTS.some(host => hostname.includes(host))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Navegación (requests de página) → network-first, offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Guardar la página principal en caché
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Estáticos → cache-first, network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (event.request.method === 'GET' && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
