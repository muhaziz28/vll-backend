import pino from 'pino';
import { env } from '@app/config/env';

export const logger = pino({
  level: env.logLevel,
  transport: env.nodeEnv === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' }
  } : undefined
});