const CACHE_NAME = 'lunar-tarot-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/style.css',
  '/assets/main.js',
  '/IMG/Logo-3.png',
  '/IMG/Logo-3.webp',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap'
];

// Dominios de API que NUNCA se cachean
const API_HOSTS = ['ynzcxucugrzlitremtus.supabase.co'];

// Instalación del Service Worker y almacenamiento en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta exitosamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Para llamadas a Supabase: SIEMPRE ir a la red (nunca cachear)
  if (API_HOSTS.some(host => requestUrl.hostname.includes(host))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para estáticos: cache first, network fallback
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
