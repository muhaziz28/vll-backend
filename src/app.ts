import express from 'express';
import helmet from 'helmet';
import { apiKeyGuard, userAgentGuard, writeRateLimiter } from '@app/middlewares/bot-guards';
import { errorHandler, notFound } from '@app/middlewares/error-handler';
import { apiRateLimiter } from '@app/middlewares/rate-limit';
import { requestLogger } from '@app/middlewares/request-logger';
import { corsMiddleware, preventHpp, requestId } from '@app/middlewares/security';
import { registerV1Routes } from '@app/routes/v1';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(preventHpp);
  app.use(requestId);
  app.use(userAgentGuard);
  app.use(corsMiddleware());
  app.use(apiRateLimiter);
  app.use(writeRateLimiter);
  app.use(apiKeyGuard);
  app.use(express.json({ limit: '512kb' }));
  app.use(express.urlencoded({ extended: true, limit: '512kb' }));

  app.use(requestLogger);

  registerV1Routes(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};