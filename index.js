const app = require('./src/app');
const config = require('./src/config');
const logger = require('./src/utils/logger');

const PORT = config.port;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.env} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});

module.exports = server;
