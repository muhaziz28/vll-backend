import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { errorHandler, notFound } from '@app/middlewares/error-handler';
import { requestLogger } from '@app/middlewares/request-logger';
import { registerV1Routes } from '@app/routes/v1';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from public directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  app.use(requestLogger);

  registerV1Routes(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
