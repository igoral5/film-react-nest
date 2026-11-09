import { Provider } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';

import { AppConfig, CONFIG_TOKEN } from '../app.config.provider';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseConnectionProvider: Provider = {
  provide: DATABASE_CONNECTION,
  inject: [CONFIG_TOKEN],
  useFactory: (config: AppConfig): Promise<Connection> =>
    createConnection(config.database.url).asPromise(),
};
