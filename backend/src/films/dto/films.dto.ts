import { Type } from 'class-transformer';
import {
  IsArray,
  IsISO8601,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

import { FilmEntity } from '../../repository/entities/film.entity';
import { ScheduleEntity } from '../../repository/entities/schedule.entity';

const SEAT_LABEL = /^\d+:\d+$/;

export class FilmDto {
  @IsUUID()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  director: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  image: string;

  @IsString()
  cover: string;

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  constructor(film: FilmEntity) {
    this.id = film.id;
    this.rating = film.rating;
    this.director = film.director;
    this.tags = film.tags;
    this.image = film.image;
    this.cover = film.cover;
    this.title = film.title;
    this.about = film.about;
    this.description = film.description;
  }
}

export class ScheduleDto {
  @IsUUID()
  id: string;

  @IsISO8601()
  daytime: string;

  @IsNumber()
  hall: number;

  @IsInt()
  @Min(1)
  rows: number;

  @IsInt()
  @Min(1)
  seats: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @Matches(SEAT_LABEL, { each: true })
  taken: string[];

  constructor(schedule: ScheduleEntity) {
    this.id = schedule.id;
    this.daytime = schedule.daytime;
    this.hall = schedule.hall;
    this.rows = schedule.rows;
    this.seats = schedule.seats;
    this.price = schedule.price;
    this.taken = schedule.taken;
  }
}

export class FilmsDto {
  @IsNumber()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilmDto)
  items: FilmDto[];

  constructor(films: FilmEntity[]) {
    this.total = films.length;
    this.items = films.map((film) => new FilmDto(film));
  }
}

export class FilmScheduleDto {
  @IsNumber()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  items: ScheduleDto[];

  constructor(schedule: ScheduleEntity[]) {
    this.total = schedule.length;
    this.items = schedule.map((item) => new ScheduleDto(item));
  }
}
