import { Schema } from 'mongoose';

export interface ScheduleEntity {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmEntity {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleEntity[];
}

const scheduleSchema = new Schema<ScheduleEntity>(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: Number, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], default: [] },
  },
  { _id: false },
);

export const filmSchema = new Schema<FilmEntity>(
  {
    id: { type: String, required: true, unique: true },
    rating: Number,
    director: String,
    tags: [String],
    image: String,
    cover: String,
    title: String,
    about: String,
    description: String,
    schedule: { type: [scheduleSchema], default: [] },
  },
  { collection: 'films', versionKey: false },
);
