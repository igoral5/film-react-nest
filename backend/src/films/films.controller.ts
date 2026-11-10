import { Controller, Get, Param } from '@nestjs/common';

import { FilmScheduleDto, FilmsDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<FilmsDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getFilmSchedule(@Param('id') id: string): Promise<FilmScheduleDto> {
    return this.filmsService.getFilmSchedule(id);
  }
}
