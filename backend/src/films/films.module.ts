import { Module } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsRepository],
})
export class FilmsModule {}
