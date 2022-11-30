const AppError = require('../utils/appError');

const handleCastError = function (err) {
  const message = `Invalid ${err.path} :${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = function (err) {
  const message = `Duplicate field value ${err.keyValue.name}.Please use another value`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// const handleWeekPassword =function(err){

// }

const handleJWTError = () => new AppError('Invalid token. Please login again!', 401);

const handleExpiredToken = () => new AppError('Expired token! Please login again', 401);

const sendErrorDev = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const sendErrorProd = function (err, res) {
  if (err.isOperational) {
    // catches all the expected errors
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // catches all the unexpected error
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log(err);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') {
      // err-example:searching for product with invalid id
      error = handleCastError(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFields(error);
    }
    if (error._message === 'Validation failed') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleExpiredToken();
    }
    sendErrorProd(error, res);
  }
};
