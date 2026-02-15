const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Add other configuration values here
  apiKeys: {
    // Example: external services
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate required configuration
const requiredEnvVars = ['PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
}

module.exports = config;
