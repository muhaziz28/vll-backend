import { Router } from 'express';
import { listKecamatan } from './city.controller';

export const cityRoute = Router();

cityRoute.get('/', listKecamatan);
