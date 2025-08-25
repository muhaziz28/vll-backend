import { Router } from 'express';
import { upload } from '@app/lib/storage';
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
bannerRouter.post('/', upload.single('image'), createBanner);
bannerRouter.put('/:id', upload.single('image'), updateBanner);
bannerRouter.delete('/:id', deleteBanner);
