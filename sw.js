/**
 * Project: Link Diretto Service Portal
 * Version: p3-fast-v22 (升级版本号以强制刷新)
 */

const CACHE_NAME = 'link-diretto-v22'; 

const ASSETS = [
  '/',                // 根路径
  'index.html',       // 分流导航页
  'index_A.html',     // 工人端
  'index_B.html',     // 维修工端
  'index_C.html',     // 工头端
  'manifest.json',
  'icon.png'
];

// 安装阶段：缓存核心资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Link Diretto: Caching system files...');
      // 使用 cache.addAll 会静默失败，如果某个文件（如 icon.png）不存在，整个缓存会失败
      // 建议确保 ASSETS 里的每个文件在 GitHub 上都真实存在
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
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Link Diretto: Removing old cache...', key);
            return caches.delete(key);
          }
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
      // 策略：缓存优先。如果缓存有就直接给，没有就去联网。
      return res || fetch(e.request);
    })
  );
});
