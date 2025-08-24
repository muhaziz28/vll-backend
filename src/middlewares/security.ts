import rtracer from 'cls-rtracer';
import cors, { CorsOptions } from 'cors';
import hpp from 'hpp';
import { env } from '@app/config/env';

export const requestId = rtracer.expressMiddleware({ useHeader: true, headerName: 'x-request-id' });

export const preventHpp = hpp();

export function buildCorsOptions(): CorsOptions {
  const origins = env.corsOrigins;
  return {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  };
}

export function corsMiddleware() {
  return cors(buildCorsOptions());
}
