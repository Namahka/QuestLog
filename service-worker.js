const CACHE_NAME = 'questhaven-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles/main.css',
  './scripts/main.js',
  './scripts/storage/storage.js',
  './scripts/systems/progression.js',
  './scripts/systems/streaks.js',
  './scripts/systems/achievements.js',
  './assets/images/realm.svg',
  './assets/icons/questhaven.svg',
  './assets/icons/questhaven-180.png',
  './assets/icons/questhaven-192.png',
  './assets/icons/questhaven-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys
      .filter(key => key.startsWith('questhaven-shell-') && key !== CACHE_NAME)
      .map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request)
      .then(response => response.ok ? response : caches.match('./index.html'))
      .catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
