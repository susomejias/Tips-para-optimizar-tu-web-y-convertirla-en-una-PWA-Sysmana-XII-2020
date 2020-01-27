// importamos workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) { //workbox solo existe en el scope del serviceWorker

    // añadimos configuración de workbox
    workbox.core.setCacheNameDetails({
        prefix: 'tallerSysmana2020-app',
        suffix: 'v1',
        precache: 'precache-cache',
        runtime: 'runtime-cache'
    });

    // cacheamos archivos html con estrategia CacheFirst
    workbox.routing.registerRoute(
        /(\w*[-]?[\.]?\w*)\.html$/,
        new workbox.strategies.CacheFirst({
            cacheName: 'cacheFirstHtml',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

    // cacheamos los archivos de imágenes con la estrategia CacheFirst
    workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg|webp|svg|ico)$/,
        new workbox.strategies.CacheFirst({
            cacheName: 'cacheFirstHtmlImages',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                }),
            ],
        })
    );

    // cacheamos todos los archivos del directorio assets con estrategia staleWhileRevalidate
    workbox.routing.registerRoute(
        /assets\/(video\/(\w*[-]?[\.]?\w*).mp4)|assets\/(js\/(\w*[-]?[\.]?\w*).js)|assets\/(css\/(\w*[-]?[\.]?\w*).css)/,
        workbox.strategies.staleWhileRevalidate()
    );

    // cacheamos el webmanifest con estrategia CacheFirst
    workbox.routing.registerRoute(
        /manifest.webmanifest/,
        new workbox.strategies.CacheFirst({
            cacheName: 'cacheFirstHtmlManifest',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

    // cacheamos CDN de librerías y el CDN  de workbox con estrategia CacheFirst
    workbox.routing.registerRoute(
        /(https:\/\/unpkg.+)|(https:\/\/cdnjs.+)|(https:\/\/cdn.+)|(https:\/\/storage\.googleapis.+)/g,
        new workbox.strategies.CacheFirst({
            cacheName: 'cacheFirstHtmlCDN',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

    // cacheamos CSS de AOS que por alguna razón no lo pilla del CDN con estrategia CacheFirst
    workbox.routing.registerRoute(
        /https:\/\/unpkg.com\/aos@next\/dist\/aos.css/g,
        new workbox.strategies.CacheFirst({
            cacheName: 'cacheFirstHtmlAOS',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );
}