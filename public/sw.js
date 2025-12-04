// Service Worker Minimalista - Apenas para permitir instalação PWA
// Sem cache offline - apenas o necessário para ser um PWA válido

self.addEventListener('install', (event) => {
  console.log('Service Worker instalado - PWA pronto para instalação');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Fetch simples - sempre busca da rede (sem cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch((error) => {
      console.log('Erro no fetch:', error);
      // Retorna uma resposta básica se o fetch falhar
      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    })
  );
});

