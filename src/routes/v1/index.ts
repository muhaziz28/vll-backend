import { Express, Router } from 'express';
import { healthRouter } from '@app/modules/health/health.route';
import { todoRouter } from '@app/modules/todo/todo.route';

export const registerV1Routes = (app: Express) => {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/todos', todoRouter);

  app.use('/api/v1', router);
};