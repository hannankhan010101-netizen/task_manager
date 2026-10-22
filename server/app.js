const express = require('express');
const cors = require('cors');

const tasksRouter = require('./routes/tasks');
const healthRouter = require('./routes/health');
const weatherRouter = require('./routes/weather');
const errorHandler = require('./middleware/errorHandler');

const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(express.json({ limit: '10kb' }));

  app.use('/api/tasks', tasksRouter);
  app.use('/api/health', healthRouter);
  app.use('/api/weather', weatherRouter);

  app.use(errorHandler);

  return app;
};

module.exports = createApp;
