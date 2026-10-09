const CACHE='henry-estadistica-v2';
const BASE=self.registration.scope;
const ASSETS=['','index.html','math.js','app.js','manifest.webmanifest','icon-192.png','icon-512.png'].map(path=>new URL(path,BASE).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!event.request.url.startsWith(BASE))return;
if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match(new URL('index.html',BASE).href)));return;}
if(ASSETS.includes(event.request.url))event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
self.addEventListener('message',event=>{if(event.data?.type==='CHECK_OFFLINE')event.waitUntil(caches.match(new URL('index.html',BASE).href).then(page=>event.ports[0]?.postMessage({ready:!!page})));});
