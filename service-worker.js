const CACHE_NAME = "bolapwa-v1";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/detail.html",
  "/pages/home.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/css/custom.css",
  "/js/materialize.min.js",
  "/manifest.json",
  "/js/api.js",
  "/js/nav.js",
  "/js/db.js",
  "/js/idb.js",
  "/js/script.js",
  "/js/notif.js",
  "/js/push.js",
  "/js/register.js",
  "/assets/icon.png",
  "/assets/icon512.png",
  "/assets/apple-icon.png",
  "/assets/favicon.ico",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  var base_url = "https://api.football-data.org/v2/";

  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function (response) {
        return response || fetch(event.request);
      })
    )
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Menerima Payload Push Notifikasi
self.addEventListener('push', function(event){
  var body;
  if (event.data) {
    body = event.data.text();
  }else {
    body = "Push pesan tanpa payload";
  }
  var options = {
    body: body,
    icon: '/assets/icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notifikasi', options)
    );
});

