import axios from 'axios';

const cache = new Map();
const TTL = 2 * 60 * 1000; // 2 minutes

function cacheKey(config) {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
}

const api = axios.create({
  baseURL: 'https://apis.27012610.xyz',
  timeout: 10000
});

api.interceptors.request.use((config) => {
  if (config.method === 'get') {
    const key = cacheKey(config);
    const hit = cache.get(key);
    if (hit && Date.now() - hit.timestamp < TTL) {
      config.adapter = () => Promise.resolve({
        data: hit.data,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config
      });
    }
  }
  return config;
});

api.interceptors.response.use((response) => {
  if (response.config.method === 'get') {
    const key = cacheKey(response.config);
    if (!cache.has(key)) {
      cache.set(key, {
        data: response.data,
        timestamp: Date.now()
      });
      if (cache.size > 100) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
      }
    }
  }
  return response;
});

function clearCache() {
  cache.clear();
}

export { clearCache };
export default api;
