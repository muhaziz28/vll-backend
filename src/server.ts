import { createServer } from 'http';
import { createApp } from '@app/app';
import { env } from '@app/config/env';
import { logger } from '@app/lib/logger';

const app = createApp();
const server = createServer(app);

server.listen(env.port, () => {
  logger.info({ port: env.port, env: env.nodeEnv }, 'server started');
});

const shutdownSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
shutdownSignals.forEach((signal) => {
  process.on(signal, () => {
    logger.info({ signal }, 'received shutdown signal');
    server.close(() => {
      logger.info('server closed');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('force exit after timeout');
      process.exit(1);
    }, 10_000).unref();
  });
});