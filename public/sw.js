const CACHE = 'lvf-cache-v1';
const ASSETS = ['/', '/index.html', '/manifest.webmanifest'];

// Instalar: guardamos los assets iniciales
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

// Activar: tomamos control inmediato de los clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Interceptar solicitudes
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // No cachear métodos no GET (POST/PUT/DELETE) — evita el error `cache.put` con POST
  if (req.method !== 'GET') {
    event.respondWith(fetch(req));
    return;
  }

  // Cache First, luego red de respaldo
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no está en caché, intentamos traerlo de la red
      return fetch(req)
        .then((networkResponse) => {
          // Guardamos copia del recurso en caché
          const copy = networkResponse.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
          return networkResponse;
        })
        .catch(() => {
          // Si falla la red y no tenemos caché, devolvemos un fallback
          if (req.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});