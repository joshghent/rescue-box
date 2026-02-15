const express = require('express');
const router = express.Router();
const healthRoutes = require('./health.routes');

// Mount routes
router.use('/health', healthRoutes);

// Add other route modules here
// router.use('/api/users', userRoutes);
// router.use('/api/posts', postRoutes);

module.exports = router;
