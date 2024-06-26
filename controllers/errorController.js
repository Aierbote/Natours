const AppError = require('../utils/appError');

// function to avoid propagating an `isOperational` error into Production
const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // NOTE : Mongo response changed over time and differs from the video lessons

  // // My solution
  // const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;

  // // A Udemy user solution
  // const values = Object.values(err.keyValue).join(',');
  // const message = `Duplicate field value(s): ${values}. Please use another value(s)`;

  // Course solution (except the updated Mongo value `message` instead of `errmsg`)
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value`;

  return new AppError(message, 400);
};
const handleValidationErrDB = (err) => {
  // here we need to loop over multiple objs inside the `errors.{[]}` field
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}.`;

  return new AppError(message, 400);
};

const handleJWTErr = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpireErr = () =>
  new AppError('Your token has expired. Please log in again!', 401);

const sendErrDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack.split('\n').map((line) => line.trim()),
    });
  }
  // RENDERED WEBSITE
  console.error('🤯 ERROR: ', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // a) Operational, trusted error: send error to Client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // b) Programming or other error: don't leak error details

    // 1) LOG ERROR
    console.error('🤯 ERROR: ', err);

    // 2) SEND GENERIC MESSAGE
    return res.status(500).json({
      status: 'error',
      message: '🫣 Something went very wrong!',
    });
  }

  // B) RENDERED WEBPAGE

  // a) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // b) Programming or other error: don't leak error details

  // 1) LOG ERROR
  console.error('🤯 ERROR: ', err);

  // 2) SEND GENERIC MESSAGE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err, name: err.name }; // without a more explicit check `name` doens't get the expected value of `CastError` or `ValidationError`

    let error = Object.create(err);

    // // DEBUG : spot the difference with or without the correction about the spread operator
    // console.log(error);
    // console.log(err.name);
    // console.log(error.name);

    if (error.name === 'CastError') error = handleCastErrDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTErr();
    if (error.name === 'TokenExpiredError') error = handleJWTExpireErr();

    sendErrProd(error, req, res);
  }

  next();
};
