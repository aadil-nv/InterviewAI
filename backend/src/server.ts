import 'reflect-metadata';
import { config } from './config/env';
import createApp from './app';
import { connectMongo } from './config/db';
import { logger } from './config/logger';
import { AddressInfo } from 'net';

async function start(): Promise<void> {
  try {
    await connectMongo();

    const app = createApp();

    const server = app.listen(Number(config.PORT), () => {
      const address = server.address() as AddressInfo;
      logger.info(`Server listening on port ${config.PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error({ err }, 'Failed to start server');
    } else {
      logger.error({ err: String(err) }, 'Failed to start server');
    }
    process.exit(1);
  }
}

start();
