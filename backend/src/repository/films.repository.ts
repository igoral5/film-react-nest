import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';

export interface SeatReservation {
  filmId: string;
  scheduleId: string;
  row: number;
  seat: number;
}

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  findAll(): Promise<FilmEntity[]> {
    return this.filmRepository.find({ order: { id: 'ASC' } });
  }

  async findSchedule(filmId: string): Promise<ScheduleEntity[] | null> {
    const film = await this.filmRepository.findOneBy({ id: filmId });

    return film
      ? this.scheduleRepository.find({
          where: { filmId },
          order: { daytime: 'ASC' },
        })
      : null;
  }

  async takeSeats(reservations: SeatReservation[]): Promise<void> {
    await this.scheduleRepository.manager.transaction(async (manager) => {
      const scheduleIds = [
        ...new Set(reservations.map((item) => item.scheduleId)),
      ];
      const schedules = await manager.find(ScheduleEntity, {
        where: { id: In(scheduleIds) },
        order: { id: 'ASC' },
        lock: { mode: 'pessimistic_write' },
      });
      const schedulesById = new Map<string, ScheduleEntity>(
        schedules.map((schedule): [string, ScheduleEntity] => [
          schedule.id,
          schedule,
        ]),
      );

      for (const { filmId, scheduleId, row, seat } of reservations) {
        const schedule = schedulesById.get(scheduleId);

        if (!schedule || schedule.filmId !== filmId) {
          throw new BadRequestException({
            error: `Schedule ${scheduleId} not found`,
          });
        }

        const seatLabel = `${row}:${seat}`;
        const isRowValid =
          Number.isInteger(row) && row >= 1 && row <= schedule.rows;
        const isSeatValid =
          Number.isInteger(seat) && seat >= 1 && seat <= schedule.seats;

        if (!isRowValid || !isSeatValid) {
          throw new BadRequestException({
            error: `Place ${seatLabel} does not exist`,
          });
        }

        if (schedule.taken.includes(seatLabel)) {
          throw new BadRequestException({
            error: `Seat ${seatLabel} is already taken`,
          });
        }

        schedule.taken.push(seatLabel);
      }
      await manager.save(schedules);
    });
  }
}
