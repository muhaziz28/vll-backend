import { Request, Response } from 'express';
import { healthService } from './health.service';

export const getHealth = (_req: Request, res: Response) => {
  const data = healthService.getStatus();
  res.json(data);
};