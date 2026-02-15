const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(healthcheck);
}));

/**
 * @route   GET /health/ready
 * @desc    Readiness check for Kubernetes/Docker
 * @access  Public
 */
router.get('/ready', asyncHandler(async (req, res) => {
  // Add checks for database connections, external services, etc.
  const checks = {
    server: 'ok',
    // database: await checkDatabaseConnection(),
    // cache: await checkCacheConnection(),
  };

  const allHealthy = Object.values(checks).every(status => status === 'ok');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'not ready',
    checks,
  });
}));

module.exports = router;
