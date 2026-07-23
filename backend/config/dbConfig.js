require('dotenv').config();

const dbUrl = process.env.DATABASE_URL || 'mysql://root:root_password@localhost:3306/astra_crm_db';

module.exports = {
  url: dbUrl,
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379/0',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_astra_jwt_encryption_key_2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key_2026',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
