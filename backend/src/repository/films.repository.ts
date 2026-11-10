import { Inject, Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';

import { DATABASE_CONNECTION } from '../database/database.provider';
import { FilmEntity, ScheduleEntity, filmSchema } from './films.schema';

@Injectable()
export class FilmsRepository {
  private readonly filmModel: Model<FilmEntity>;

  constructor(@Inject(DATABASE_CONNECTION) connection: Connection) {
    this.filmModel = connection.model<FilmEntity>('Film', filmSchema);
  }

  findAll(): Promise<FilmEntity[]> {
    return this.filmModel
      .find({}, { _id: 0, schedule: 0 })
      .lean<FilmEntity[]>()
      .exec();
  }

  findById(filmId: string): Promise<FilmEntity | null> {
    return this.filmModel
      .findOne({ id: filmId }, { _id: 0 })
      .lean<FilmEntity>()
      .exec();
  }

  async findSchedule(filmId: string): Promise<ScheduleEntity[] | null> {
    const film = await this.filmModel
      .findOne({ id: filmId }, { _id: 0, schedule: 1 })
      .lean<FilmEntity>()
      .exec();

    return film ? film.schedule : null;
  }

  async takeSeats(
    filmId: string,
    scheduleId: string,
    seats: string[],
  ): Promise<boolean> {
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          schedule: {
            $elemMatch: { id: scheduleId, taken: { $nin: seats } },
          },
        },
        { $push: { 'schedule.$.taken': { $each: seats } } },
      )
      .exec();

    return result.modifiedCount > 0;
  }
}
