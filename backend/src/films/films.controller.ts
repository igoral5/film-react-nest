import { Controller, Get, Param } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import { ErrorDto } from '../common/dto/error.dto';
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
  @ApiNotFoundResponse({
    description: 'Фильм с указанным id не найден',
    type: ErrorDto,
  })
  getFilmSchedule(@Param('id') id: string): Promise<FilmScheduleDto> {
    return this.filmsService.getFilmSchedule(id);
  }
}
