
self.addEventListener('install', async (event) => {
    // Cache the app shell and essential assets during installation
    const cache = await caches.open('poll-cache');
    await cache.addAll([
      'index.html',
    ]);
  });
  
  self.addEventListener('fetch', async (event) => {
    event.respondWith(networkFallingBackToCache(event.request));
  });
  
  async function networkFallingBackToCache(request) {
    try {
      // Try fetching the resource from the network
      const response = await fetch(request);
  
      // If the response is successful, clone it to store it in the cache
      if (response.status === 200) {
        const cache = await caches.open('poll-cache');
        await cache.put(request, response.clone());
      }
  
      // Return the network response
      return response;
    } 
    catch (error) {
      // If the network request fails, try to retrieve the resource from the cache
      const cacheResponse = await caches.match(request);
      if (cacheResponse) {
        return cacheResponse;
      }
      // If the resource is not in the cache, return a fallback response (e.g., a custom offline page)
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
  }