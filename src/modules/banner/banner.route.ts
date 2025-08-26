import { Router } from 'express';
import { upload } from '@app/lib/storage';
import { requireAdminAuth } from '@app/middlewares/require-auth';
import {
  listBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  getActiveBanners,
} from './banner.controller';

export const bannerRouter = Router();

bannerRouter.get('/', listBanners);
bannerRouter.get('/active', getActiveBanners);
bannerRouter.get('/:id', getBanner);
bannerRouter.post('/', requireAdminAuth, upload.single('image'), createBanner);
bannerRouter.put('/:id', requireAdminAuth, upload.single('image'), updateBanner);
bannerRouter.delete('/:id', requireAdminAuth, deleteBanner);
