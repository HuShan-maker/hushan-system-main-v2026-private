/**
 * Project: Link Diretto Service Portal
 * Version: p3-fast-v21
 * Description: Service Worker for offline support and PWA assets caching.
 */

const CACHE_NAME = 'link-diretto-v21'; // 名字已统一，版本号已升级

const ASSETS = [
  './',
  './index.html',
  './index_A.html',
  './index_B.html',
  './index_C.html',
  './manifest.json',
  './icon.png'
];

// 安装阶段：缓存核心资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Link Diretto: Caching system files...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活阶段：清理旧版本缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('Link Diretto: Removing old cache...', key);
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求：优先从缓存读取
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
