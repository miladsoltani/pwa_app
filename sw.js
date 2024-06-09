const cacheVersion = 1;
const activeCaches = {
  static: `static-v${cacheVersion}`,
  dynamic: `dynamic-v${cacheVersion}`,
};
                               
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(activeCaches["static"]).then((cache) => {
      cache.addAll(["/", "asset/js/app.js", "fallback.html"]);
    })
  );
});

self.addEventListener("activate", (event) => {
  const activeCacheVersion = Object.values(activeCaches);
  caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.forEach((cacheName) => {
        if (!activeCacheVersion.includes(cacheName)) {
          caches.delete(cacheName);
        }
      })
    );
  });
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then((serverResponse) => {
            caches.open(activeCaches["dynamic"]).then((cache) => {
              cache.put(event.request, serverResponse.clone());
              return serverResponse;
            });
          })
        .catch((err) => {
          return caches.match("/fallback.html");
        })
          }
          })
  );
});
