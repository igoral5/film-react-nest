import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const CONFIG_TOKEN = 'CONFIG';

export const configProvider: Provider = {
  provide: CONFIG_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<'postgres'>('DATABASE_DRIVER'),
      url: configService.get<string>('DATABASE_URL'),
      username: configService.get<string>('DATABASE_USERNAME') || undefined,
      password: configService.get<string>('DATABASE_PASSWORD') || undefined,
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: 'postgres';
  url: string;
  username: string;
  password: string;
}
