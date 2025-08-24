import { Router } from 'express';
import { requireAuth } from '@app/middlewares/require-auth';
import { googleSignIn, login, me, refresh, register } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.post('/google', googleSignIn);
authRouter.get('/me', requireAuth, me);