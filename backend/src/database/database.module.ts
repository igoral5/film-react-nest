import { Global, Module } from '@nestjs/common';

import { configProvider } from '../app.config.provider';
import {
  DATABASE_CONNECTION,
  databaseConnectionProvider,
} from './database.provider';

@Global()
@Module({
  providers: [configProvider, databaseConnectionProvider],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
