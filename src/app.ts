import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from '@app/middlewares/request-logger';
import { errorHandler, notFound } from '@app/middlewares/error-handler';
import { registerV1Routes } from '@app/routes/v1';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  registerV1Routes(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};