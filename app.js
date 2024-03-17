const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./utils/loggers');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

const app = express();
const notesRouter = require('./controller/notes');

mongoose.set('strictQuery', false);
const url = config.MONGODB_URI;
logger.info('connecting to', url);
mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
