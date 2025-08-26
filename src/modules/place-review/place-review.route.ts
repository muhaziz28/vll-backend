import { Router } from 'express';
import { upload } from '@app/lib/storage';
import { requireAuth } from '@app/middlewares/require-auth';
import { getReviewByPlace, createReview } from './place-review.controller';

export const placeReviewRouter = Router();

placeReviewRouter.get('/:id', getReviewByPlace);
placeReviewRouter.post('/:id', requireAuth, upload.array('image'), createReview);
