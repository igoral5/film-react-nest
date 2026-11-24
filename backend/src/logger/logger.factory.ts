import { LoggerService } from '@nestjs/common';

import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

type LoggerType = 'dev' | 'json' | 'tskv';

const LOGGERS: Record<LoggerType, new () => LoggerService> = {
  dev: DevLogger,
  json: JsonLogger,
  tskv: TskvLogger,
};

const isLoggerType = (value: string): value is LoggerType => value in LOGGERS;

/**
 * Тип логгера берётся из переменной окружения LOGGER.
 * По умолчанию: json в продакшене и dev во всех остальных случаях.
 */
export const createLogger = (): LoggerService => {
  const requested = process.env.LOGGER ?? '';
  let type: LoggerType = process.env.NODE_ENV === 'production' ? 'json' : 'dev';

  if (isLoggerType(requested)) {
    type = requested;
  }

  return new LOGGERS[type]();
};
