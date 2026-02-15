const { AppError } = require('./errorHandler');

/**
 * Validate request body against a schema
 * @param {Function} validator - Validation function that returns {error, value}
 */
const validateRequest = (validator) => {
  return (req, res, next) => {
    const { error, value } = validator(req.body);
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }
    
    req.validatedBody = value;
    next();
  };
};

/**
 * Validate request query parameters
 */
const validateQuery = (validator) => {
  return (req, res, next) => {
    const { error, value } = validator(req.query);
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }
    
    req.validatedQuery = value;
    next();
  };
};

module.exports = { validateRequest, validateQuery };
