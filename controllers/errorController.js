const sendErrDevs = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  // Operational, trusted error: send error to Client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other error: don't leak error details

  // 1) LOG ERROR
  console.error('🤯 ERROR: ', err);

  // 2) SEND GENERIC MESSAGE
  res.status(500).json({
    status: 'error',
    message: '🫣 Something went very wrong!',
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack)

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDevs(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrProd(err, res);
  }

  next();
};
