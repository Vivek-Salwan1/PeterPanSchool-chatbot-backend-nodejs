const express = require('express');
const cors = require('cors');

const { env } = require('./config/env');
const chatRouter = require('./routes/chatRoutes');
const guidedFlowRouter = require('./routes/guidedFlowRoutes');
const healthRouter = require('./routes/healthRoutes');
const { requestLogger } = require('./middleware/requestLogger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin: env.allowedOrigins,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    })
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(requestLogger);

  app.use('/', healthRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/guided-flow', guidedFlowRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

