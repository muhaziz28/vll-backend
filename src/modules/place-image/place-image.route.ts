import { Router } from 'express';
import { upload } from '@app/lib/storage';
import { requireAdminAuth } from '@app/middlewares/require-auth';
import { createPlaceImage, deletePlaceImage, listPlaceImages } from './place-image.controller';

export const placeImagesRouter = Router();

placeImagesRouter.post('/:id', requireAdminAuth, upload.single('image'), createPlaceImage);
placeImagesRouter.get('/:id', listPlaceImages);
placeImagesRouter.delete('/:id', requireAdminAuth, deletePlaceImage);
