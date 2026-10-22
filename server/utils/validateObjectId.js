const mongoose = require('mongoose');

/**
 * Express middleware that validates a route param is a well-formed
 * Mongo ObjectId before any database lookup is attempted.
 */
const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({ error: `Invalid ${paramName}` });
  }

  return next();
};

module.exports = validateObjectId;
