// Service Worker Minimalista - Apenas para permitir instalação PWA
// Sem cache offline - apenas o necessário para ser um PWA válido

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado - PWA pronto para instalação');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  return self.clients.claim();
});

// Fetch simples - sempre busca da rede (sem cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

