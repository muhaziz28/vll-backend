import { Express, Router } from 'express';
import { authRouter } from '@app/modules/auth/auth.route';
import { healthRouter } from '@app/modules/health/health.route';
import { todoRouter } from '@app/modules/todo/todo.route';

export const registerV1Routes = (app: Express) => {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/todos', todoRouter);
  router.use('/auth', authRouter);

  app.use('/api/v1', router);
};