const STATIC_CACHE_NAME = "static-cache-jeap";
const respCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
  return cache.addAll([
    "/",
    "/index.html",
    "/productos.html",
    "/src/app.js",
    "/images/image.png",
    "/images/screenshot-desktop.png",
    "/images/screenshot-mobile.png"
  ]);
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/productos.html",
        "/src/app.js",
        "/images/image.png",
        "/images/screenshot-desktop.png",
        "/images/screenshot-mobile.png"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          } else if (event.request.destination === "image") {
            return caches.match("/images/image.png");
          } else {
            return new Response("Sin conexión y recurso no disponible", {
              status: 503,
              statusText: "Service Unavailable",
            });
          }
        })
      );
    })
  );
});
