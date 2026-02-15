const config = require('../config');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = levels[config.logging.level] || levels.info;

const log = (level, message) => {
  if (levels[level] <= currentLevel) {
    const timestamp = new Date().toISOString();
    const logMessage = typeof message === 'object' 
      ? JSON.stringify(message) 
      : message;
    
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${logMessage}`);
  }
};

const logger = {
  error: (message) => log('error', message),
  warn: (message) => log('warn', message),
  info: (message) => log('info', message),
  debug: (message) => log('debug', message),
};

module.exports = logger;
