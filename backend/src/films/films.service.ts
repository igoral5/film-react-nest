import { Injectable, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';

import { FilmsRepository } from '../repository/films.repository';
import { FilmScheduleDto, FilmsDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmsDto> {
    const films = await this.filmsRepository.findAll();
    return new FilmsDto(films);
  }

  async getFilmSchedule(filmId: string): Promise<FilmScheduleDto> {
    const schedule = isUUID(filmId)
      ? await this.filmsRepository.findSchedule(filmId)
      : null;

    if (!schedule) {
      throw new NotFoundException({ error: 'Film not found' });
    }

    return new FilmScheduleDto(schedule);
  }
}
