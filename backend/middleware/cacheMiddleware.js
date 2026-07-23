const redisClient = require('../config/redis');

function routeCache(moduleName) {
  return async (req, res, next) => {
    if (!redisClient || !req.tenant) {
      return next();
    }

    const tenantId = req.tenant.id;
    const cacheKey = `cache:${tenantId}:${moduleName}`;

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`[Redis Cache Hit] Serving ${moduleName} for tenant ${tenantId}`);
        return res.json(JSON.parse(cachedData));
      }

      // Override res.json to cache response payload
      const originalJson = res.json;
      res.json = function (data) {
        redisClient.set(cacheKey, JSON.stringify(data), 'EX', 300); // 5 minutes TTL
        console.log(`[Redis Cache Miss] Seeding ${moduleName} to cache for tenant ${tenantId}`);
        return originalJson.call(this, data);
      };

      next();
    } catch (err) {
      console.error('Redis cache middleware error:', err);
      next();
    }
  };
}

async function invalidateCache(tenantId, moduleName) {
  if (redisClient) {
    const cacheKey = `cache:${tenantId}:${moduleName}`;
    await redisClient.del(cacheKey);
    console.log(`[Redis Cache Invalidation] Cleared ${moduleName} for tenant ${tenantId}`);
  }
}

module.exports = {
  routeCache,
  invalidateCache
};
