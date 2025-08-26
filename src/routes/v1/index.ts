import { Express, Router } from 'express';
import { authRouter } from '@app/modules/auth/auth.route';
import { bannerRouter } from '@app/modules/banner/banner.route';
import { healthRouter } from '@app/modules/health/health.route';
import { placesRouter } from '@app/modules/place/place.route';
import { placeImagesRouter } from '@app/modules/place-image/place-image.route';
import { todoRouter } from '@app/modules/todo/todo.route';

export const registerV1Routes = (app: Express) => {
  const router = Router();

  router.use('/health', healthRouter);
  router.use('/todos', todoRouter);
  router.use('/auth', authRouter);
  router.use('/banners', bannerRouter);
  router.use('/places', placesRouter);
  router.use('/place-images', placeImagesRouter);

  app.use('/api/v1', router);
};
