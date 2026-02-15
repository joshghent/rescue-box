const express = require('express');
const config = require('./config');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
if (config.env !== 'test') {
  app.use(requestLogger);
}

// CORS (if needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Mount routes
app.use('/', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
