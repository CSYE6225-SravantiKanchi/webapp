const httpStatus = require('http-status');
const { isCelebrateError } = require('celebrate');

exports.validationError = (err, req, res, next) => {
    // If this isn't a Celebrate error, send it to the next error handler
    if (!isCelebrateError(err)) {
      return next(err);
    }
    return  res.status(httpStatus.BAD_REQUEST).json().send();
  };


exports.notFoundError = (req, res, next) => {
    return  res.status(httpStatus.NOT_FOUND).json().send();
  };
