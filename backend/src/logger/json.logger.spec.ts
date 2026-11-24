import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let logSpy: jest.SpyInstance;

  const lastEntry = () => JSON.parse(logSpy.mock.calls[0][0] as string);

  beforeEach(() => {
    logger = new JsonLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('пишет log-сообщение в формате JSON', () => {
    logger.log('Список фильмов получен', 'FilmsService');

    const entry = lastEntry();
    expect(entry.level).toBe('log');
    expect(entry.message).toBe('Список фильмов получен');
    expect(entry.optionalParams).toEqual(['FilmsService']);
    expect(typeof entry.time).toBe('string');
  });

  it('пишет ошибку в формате JSON', () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('Фильм не найден', { id: '42' });

    const entry = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(entry.level).toBe('error');
    expect(entry.message).toBe('Фильм не найден');
    expect(entry.optionalParams).toEqual([{ id: '42' }]);
  });

  it('пишет предупреждение в формате JSON', () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    logger.warn('Место уже занято');

    const entry = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(entry.level).toBe('warn');
    expect(entry.message).toBe('Место уже занято');
  });
});
