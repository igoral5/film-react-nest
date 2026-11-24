import { Test } from '@nestjs/testing';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  const filmsService = {
    getFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsService }],
    }).compile();

    controller = moduleRef.get(FilmsController);
  });

  it('возвращает список фильмов из сервиса', async () => {
    const films = { total: 2, items: [] };
    filmsService.getFilms.mockResolvedValue(films);

    await expect(controller.getFilms()).resolves.toBe(films);
    expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
  });

  it('возвращает расписание фильма по id', async () => {
    const schedule = { total: 1, items: [] };
    filmsService.getFilmSchedule.mockResolvedValue(schedule);

    await expect(controller.getFilmSchedule('film-id')).resolves.toBe(schedule);
    expect(filmsService.getFilmSchedule).toHaveBeenCalledWith('film-id');
  });

  it('пробрасывает ошибку сервиса, если фильм не найден', async () => {
    filmsService.getFilmSchedule.mockRejectedValue(new Error('Film not found'));

    await expect(controller.getFilmSchedule('unknown')).rejects.toThrow(
      'Film not found',
    );
  });
});
