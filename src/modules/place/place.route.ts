import { Router } from 'express';
import { upload } from '@app/lib/storage';
import { requireAdminAuth } from '@app/middlewares/require-auth';
import { listPlaces, createPlace, getPlace, deletePlace, updatePlace } from './place.controller';

export const placesRouter = Router();

placesRouter.get('/', listPlaces);
placesRouter.get('/:id', getPlace);
placesRouter.post('/', requireAdminAuth, upload.single('image'), createPlace);
placesRouter.put('/:id', requireAdminAuth, upload.single('image'), updatePlace);
placesRouter.delete('/:id', requireAdminAuth, deletePlace);
