importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
     
if (workbox)
	console.log(`Workbox berhasil dimuat`);
else
	console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
	{url:"/nav.html", revision: "1"},
	{url:"/index.html", revision: "1"},
	{url:"/detail.html", revision: "1"},
	{url:"/css/materialize.min.css", revision: "1"},
	{url:"/css/custom.css", revision: "2"},
	{url:"/manifest.json", revision: "1"},
]);

workbox.routing.registerRoute(
	new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
    	cacheName: 'pages'
    })
);

workbox.routing.registerRoute(
	new RegExp('/js/'),
    workbox.strategies.staleWhileRevalidate({
    	cacheName: 'js'
    })
);

workbox.routing.registerRoute(
    new RegExp('/assets/'),
    	workbox.strategies.staleWhileRevalidate({
        cacheName: 'assets',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
          }),
        ],
    })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

workbox.routing.registerRoute(
    new RegExp('/css/'),
    workbox.strategies.cacheFirst({
        cacheName: 'styles'
    })
);
workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
          }),
        ],
    }),
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
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

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org\/v2/,
    workbox.strategies.networkFirst({
        networkTimeoutSeconds: 3,     // 3 detik
        cacheName: 'base_url'
    })
);



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