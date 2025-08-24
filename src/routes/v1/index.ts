import { Express, Router } from 'express';
import { healthRouter } from '@app/modules/health/health.route';

export const registerV1Routes = (app: Express) => {
  const router = Router();

  router.use('/health', healthRouter);

  app.use('/api/v1', router);
};