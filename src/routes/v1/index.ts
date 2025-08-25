import { Express, Router } from 'express';
import { authRouter } from '@app/modules/auth/auth.route';
import { healthRouter } from '@app/modules/health/health.route';
import { todoRouter } from '@app/modules/todo/todo.route';
import { bannerRouter } from '@app/modules/banner/banner.route';

export const registerV1Routes = (app: Express) => {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/todos', todoRouter);
  router.use('/auth', authRouter);
  router.use('/banners', bannerRouter);

  app.use('/api/v1', router);
};
