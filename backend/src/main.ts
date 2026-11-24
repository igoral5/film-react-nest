import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createLogger } from './logger/logger.factory';

const getConstraints = (errors: ValidationError[]): string[] =>
  errors.flatMap((error) => [
    ...Object.values(error.constraints ?? {}),
    ...getConstraints(error.children ?? []),
  ]);

async function bootstrap() {
  // bufferLogs хранит ранние логи, пока не подключён наш логгер.
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(createLogger());
  app.setGlobalPrefix('api/afisha');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) =>
        new BadRequestException({ error: getConstraints(errors).join('; ') }),
    }),
  );
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Backend Film Nest.js')
    .setDescription('Backend сервиса по продаже билетов')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(3000);
}
bootstrap();
