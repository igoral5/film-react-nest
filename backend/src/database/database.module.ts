import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import {
  AppConfig,
  CONFIG_TOKEN,
  configProvider,
} from '../app.config.provider';
import { FilmEntity } from '../repository/entities/film.entity';
import { ScheduleEntity } from '../repository/entities/schedule.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [CONFIG_TOKEN],
      useFactory: (config: AppConfig): TypeOrmModuleOptions => ({
        type: config.database.driver,
        url: config.database.url,
        username: config.database.username,
        password: config.database.password,
        entities: [FilmEntity, ScheduleEntity],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  providers: [configProvider],
  exports: [TypeOrmModule, configProvider],
})
export class DatabaseModule {}
