'use strict';

const logger = require('./logger');

/**
 * Response cache.
 *
 * Default backend is an in-memory TTL map. When REDIS_ENABLED=true the cache
 * tries to use a Redis backend (requires the optional `redis` package and a
 * REDIS_URL). If Redis is unavailable it falls back to memory and logs a
 * warning - set REDIS_ENABLED=false to silence it.
 */

const DEFAULT_TTL_MS = Number.parseInt(process.env.CACHE_TTL_MS, 10) || 5 * 60 * 1000;

class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key, value, ttlMs = DEFAULT_TTL_MS) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}

class RedisCache {
  constructor(client) {
    this.client = client;
  }

  get(key) {
    return this.client.get(key).then((raw) => (raw ? JSON.parse(raw) : undefined));
  }

  set(key, value, ttlMs = DEFAULT_TTL_MS) {
    return this.client.set(key, JSON.stringify(value), { PX: ttlMs });
  }
}

function createCache() {
  const redisEnabled = String(process.env.REDIS_ENABLED || 'false').toLowerCase() === 'true';

  if (redisEnabled) {
    try {
      // Optional dependency - only required when Redis is enabled.
      // eslint-disable-next-line global-require
      const { createClient } = require('redis');
      const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
      client.on('error', (err) => logger.warn('Redis error, using in-memory cache:', err.message));
      client.connect().catch((err) => logger.warn('Redis connect failed:', err.message));
      logger.info('Cache backend: redis');
      return new RedisCache(client);
    } catch (err) {
      logger.warn('Redis enabled but `redis` package is not installed - falling back to memory cache.');
    }
  }

  logger.debug('Cache backend: memory');
  return new MemoryCache();
}

const cache = createCache();

/**
 * Express middleware that caches successful JSON responses by URL.
 */
function cacheMiddleware(req, res, next) {
  const key = `http:${req.originalUrl}`;
  Promise.resolve(cache.get(key))
    .then((hit) => {
      if (hit !== undefined) {
        logger.debug('Cache hit:', key);
        return res.json(hit);
      }
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          Promise.resolve(cache.set(key, body)).catch(() => {});
        }
        return originalJson(body);
      };
      next();
    })
    .catch(() => next());
}

module.exports = { cache, cacheMiddleware, MemoryCache };
