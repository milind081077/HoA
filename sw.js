/* House of Ambition SW v2026-08-02 */
var CACHE='hoa-v2026-08-02';
self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(['./index.html','./manifest.json','./icon-192.png','./icon-512.png']);
  }).catch(function(){}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(cached){
    var net=fetch(e.request).then(function(r){
      if(r&&r.status===200&&r.type!=='opaque'){
        var cl=r.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,cl);});
      }
      return r;
    }).catch(function(){return cached;});
    return cached||net;
  }));
});
self.addEventListener('message',function(e){
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});