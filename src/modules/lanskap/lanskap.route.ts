import { Router } from 'express';
import { upload } from '@app/lib/storage';
import { requireAdminAuth } from '@app/middlewares/require-auth';
import { create, list, remove, update } from './lanskap.controller';

export const lanskapRouter = Router();

lanskapRouter.get('/', list);
lanskapRouter.post('/', requireAdminAuth, upload.single('file'), create);
lanskapRouter.put('/:id', requireAdminAuth, upload.single('file'), update);
lanskapRouter.delete('/:id', requireAdminAuth, remove);
