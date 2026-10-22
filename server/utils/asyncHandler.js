/**
 * Wraps an async Express route handler so that any rejected promise is
 * forwarded to next(), where the central error handler can process it.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
