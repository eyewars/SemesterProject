const cacheName = "v1";
const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/js/app.js",
    "/js/templateManager.mjs",
    "/js/draw.mjs",
    "/js/clientConnect.mjs",
    "/js/fetchHandler.mjs",
    "/js/localStorageHandler.mjs",
    "/js/socketEmitHandler.mjs",
    "/js/getInfo.mjs",
    "/manifest.json",
    "/images/logo.png",
    "https://cdn.socket.io/4.7.4/socket.io.esm.min.js"
];

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
};

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    return fetch(request);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache(assets)
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
})