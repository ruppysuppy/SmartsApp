const STATIC_CACHE = "static-cache-v1"
const static_assets = [
    "/index.html",
    "/style.css",
    "/favicon.ico",
    "/logo192.png",
    "/logo512.png",
]

// storing static assets in cache on service worker install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            cache.addAll(static_assets)
        })
    )
})

// returning static assets from cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    )
});