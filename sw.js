const CACHE = 'portal-diagnostika-v1';
const ASSETS = ['./', './index.html', './manifest.json', './assets/logo-dark.png', './assets/icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Não interfere em chamadas aos sub-apps (/pmp/, /admin/) — só faz cache do portal
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/pmp/') || url.pathname.startsWith('/admin/')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
