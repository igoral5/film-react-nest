import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createConnection } from 'mongoose';

import { FilmEntity } from '../repository/films.schema';

const DEFAULT_DATABASE_URL = 'mongodb://localhost:27017/practicum';

async function seed(): Promise<void> {
  const url = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;
  const stubPath = join(
    __dirname,
    '..',
    '..',
    'test',
    'mongodb_initial_stub.json',
  );
  const films = JSON.parse(readFileSync(stubPath, 'utf8')) as FilmEntity[];

  const connection = await createConnection(url).asPromise();

  await connection.collection('films').deleteMany({});
  await connection.collection('films').insertMany(films);
  await connection.close();

  console.log(`Loaded ${films.length} films into ${url}`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
