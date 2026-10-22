const express = require('express');
const cors = require('cors');

const tasksRouter = require('./routes/tasks');
const healthRouter = require('./routes/health');

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

  return app;
};

module.exports = createApp;
