/* eslint-disable consistent-return */
const logger = require('./loggers');

const errorHandler = (error, req, res, next) => {
  logger.error(error);
  if (error.name === 'CastError') { return res.status(400).json({ message: 'Malformatted ID' }); }
  if (error.name === 'ValidationError') { return res.status(400).json({ error: error.message }); }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
  errorHandler,
  unknownEndpoint,
};
