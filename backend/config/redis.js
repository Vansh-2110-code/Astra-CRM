const Redis = require('ioredis');
const { redisUrl } = require('./dbConfig');

let redisClient;

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err.message);
  });

  redisClient.on('connect', () => {
    console.log('🔌 Connected to Redis cache store.');
  });
} catch (error) {
  console.error('Failed to initialize Redis client:', error);
}

module.exports = redisClient;
