/**
 * Central error-handling middleware. Must be registered last, after all
 * routes. Logs the real error server-side and returns a safe, generic
 * payload to the client so no stack trace or internal detail ever leaks.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((validationError) => validationError.message)
      .join(', ');
    return res.status(400).json({ error: message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid identifier' });
  }

  return res.status(500).json({ error: 'Something went wrong' });
};

module.exports = errorHandler;
