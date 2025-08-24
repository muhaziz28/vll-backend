import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  CORS_ORIGINS: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  WRITE_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60 * 1000),
  WRITE_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  API_KEYS: z.string().optional(),
  UA_DENYLIST: z.string().optional(),
  JWT_SECRET: z.string().min(16).default('devsecretdevsecretdevsecretdevsecret'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(7),
  GOOGLE_CLIENT_ID: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const defaultCorsOrigins = ['http://localhost:3000'];

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  logLevel: parsed.data.LOG_LEVEL,
  corsOrigins: parsed.data.CORS_ORIGINS
    ? parsed.data.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
    : defaultCorsOrigins,
  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: parsed.data.RATE_LIMIT_MAX,
  writeRateLimitWindowMs: parsed.data.WRITE_RATE_LIMIT_WINDOW_MS,
  writeRateLimitMax: parsed.data.WRITE_RATE_LIMIT_MAX,
  apiKeys: parsed.data.API_KEYS ? parsed.data.API_KEYS.split(',').map((s) => s.trim()).filter(Boolean) : [],
  uaDenylist: parsed.data.UA_DENYLIST ? parsed.data.UA_DENYLIST.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : [],
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  refreshTokenExpiresDays: parsed.data.REFRESH_TOKEN_EXPIRES_DAYS,
  googleClientId: parsed.data.GOOGLE_CLIENT_ID,
};
