(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            });
    }

    var cacheName = 'weatherPWA-step-5-1';
    var filesToCache = [
        '/',
        '/index.html',
        '/scripts/app.js',
        '/scripts/keyvalStore.js',
        '/styles/inline.css',
        '/images/clear.png',
        '/images/cloudy-scattered-showers.png',
        '/images/cloudy.png',
        '/images/fog.png',
        '/images/ic_add_white_24px.svg',
        '/images/ic_refresh_white_24px.svg',
        '/images/partly-cloudy.png',
        '/images/rain.png',
        '/images/scattered-showers.png',
        '/images/sleet.png',
        '/images/snow.png',
        '/images/thunderstorm.png',
        '/images/wind.png'
    ];

    this.addEventListener('install', function (e) {
        console.log('[ServiceWorker] Install');
        e.waitUntil(
            caches.open(cacheName).then(function (cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })
        )
    });

    this.addEventListener('activate', function (e) {
        console.log('[ServiceWorker] Activate');
        e.waitUntil(
            caches.keys().then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                }));
            })
        );
    });

    this.addEventListener('fetch', function (e) {
        console.log('[ServiceWorker] Fetch', e.request.url);
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            })
        );
    });
})();