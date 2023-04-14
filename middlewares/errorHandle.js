const ErrorResponse = require('../common/ErrorResponse');
const logger = require('../config/logger');

const errorHandle = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error on dev
  logger.error(err.stack);

  // MongoDB bad ObjectID
  if (err.name === 'CastError') {
    error = new ErrorResponse(error.message, 404);
  }

  //MongoDB duplicate value key
  if (err.code === 11000) {
    error = new ErrorResponse(error.message, 400);
  }

  // MongoDB validation failed
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Error jwt validation
  if (err.name === 'JsonWebTokenError') {
    error = new ErrorResponse(error.message, 401);
  }

  // Error jwt expired
  if (err.name === 'TokenExpiredError') {
    error = new ErrorResponse(error.message, 401);
  }

  res.status(error.statusCode || 500).json({
    msg: error.message || 'Server Error',
  });
};

module.exports = errorHandle;
