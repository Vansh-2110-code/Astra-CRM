const Redis = require('ioredis');
const { redisUrl } = require('./dbConfig');

let redisClient = null;

// Only attempt Redis connection if REDIS_URL is explicitly set and not empty
if (process.env.REDIS_ENABLED === 'true' && redisUrl) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 0,       // Fail immediately — never block the request lifecycle
      retryStrategy: () => null,     // Disable all reconnection attempts — fail gracefully
      lazyConnect: true,             // Don't connect until first command
      enableOfflineQueue: false,     // Drop commands immediately when offline
      connectTimeout: 2000
    });

    redisClient.on('error', (err) => {
      console.warn('[Redis] Cache unavailable — running in no-cache mode:', err.message);
      redisClient = null; // Nullify so callers get the no-cache path
    });

    redisClient.on('connect', () => {
      console.log('🔌 Redis cache store connected.');
    });

    redisClient.connect().catch(() => {
      console.warn('[Redis] Could not connect — falling back to no-cache mode.');
      redisClient = null;
    });

  } catch (error) {
    console.warn('[Redis] Initialization skipped:', error.message);
    redisClient = null;
  }
} else {
  console.log('[Redis] Disabled — running in no-cache mode (set REDIS_ENABLED=true to enable).');
}

module.exports = redisClient;
