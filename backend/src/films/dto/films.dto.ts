import { FilmEntity, ScheduleEntity } from '../../repository/films.schema';

export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
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
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
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
  total: number;
  items: FilmDto[];

  constructor(films: FilmEntity[]) {
    this.total = films.length;
    this.items = films.map((film) => new FilmDto(film));
  }
}

export class FilmScheduleDto {
  total: number;
  items: ScheduleDto[];

  constructor(schedule: ScheduleEntity[]) {
    this.total = schedule.length;
    this.items = schedule.map((item) => new ScheduleDto(item));
  }
}
