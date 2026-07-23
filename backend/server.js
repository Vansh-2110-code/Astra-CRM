const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const apiRoutes = require('./routes');
const sequelize = require('./config/database');
const { seedDatabase } = require('./config/dbInit');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { port, nodeEnv, frontendUrl } = require('./config/dbConfig');

const app = express();

// Secure Express headers (XSS protection, referrer policy, framing guards)
app.use(helmet());

// Configure strict CORS origin limits
const allowedOrigins = [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by Security CORS Policy'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Set up Winston + Morgan logging
const morganFormat = nodeEnv === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// API Request Rate Limiter (Prevent DDoS / Brute Force attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: nodeEnv === 'test' ? 100000 : 150,
  message: { error: "Too many requests. Cyber-Security block triggered. Please retry in 15 minutes." }
});
app.use('/api/', apiLimiter);

const http = require('http');
const { initSocket } = require('./config/socket');

const { initCronJobs } = require('./config/cronWorker');

const server = http.createServer(app);

// Mount Modular API Routes
app.use('/api', apiRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Database Sync and Seeding Initialization
async function startServer() {
  try {
    logger.info('🔌 Connecting to MySQL database...');
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // Sync tables and seed initial data in development/test
    await seedDatabase();

    // Initialize Socket.IO real-time bindings
    initSocket(server);

    // Start background cron worker routines
    initCronJobs();

    server.listen(port, () => {
      logger.info(`🚀 Astra CRM Enterprise SaaS Backend running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});
