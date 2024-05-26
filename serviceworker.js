const staticDevCoffee = "dev-coffee-site-v1"
const assets = [
  "/",
  "/index.html",
  "/htmlPages/gotoconsole.html",
  "/htmlPages/login.html",
  "/htmlPages/signup.html",
  "/app.js",
  "/Js/console.js",
  "/Js/login.js",
  "/Js/signup.js",
  "/Js/toggler.js",
  "/app.js",
  "/firebase.js",
  "/toggler.css",
  "/style.css",
  "/manifest.json",
  "/serviceworker.js",
  "/images/icons/icon-48x48.png",
  "/images/icons/icon-72x72.png",
  "/images/icons/icon-96x96.png",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-512x512.png",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})