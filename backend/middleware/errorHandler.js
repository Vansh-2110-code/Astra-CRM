const { nodeEnv } = require('../config/dbConfig');

function errorHandler(err, req, res, next) {
  console.error('[Global Error Guard Exception]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(nodeEnv === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
