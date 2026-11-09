import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const CONFIG_TOKEN = 'CONFIG';

export const configProvider: Provider = {
  provide: CONFIG_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER'),
      url: configService.get<string>('DATABASE_URL'),
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
