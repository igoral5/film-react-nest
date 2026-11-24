import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('форматирует запись как key=value через табуляцию', () => {
    logger.log('Список фильмов получен');

    expect(logSpy).toHaveBeenCalledWith(
      'level=log\tmessage=Список фильмов получен\n',
    );
  });

  it('добавляет дополнительные параметры полями param0, param1', () => {
    logger.log('Заказ создан', 'OrderService', 3);

    const fields = (logSpy.mock.calls[0][0] as string).trim().split('\t');

    expect(fields).toEqual([
      'level=log',
      'message=Заказ создан',
      'param0=OrderService',
      'param1=3',
    ]);
  });

  it('заменяет табуляцию и переводы строк в значениях на пробелы', () => {
    logger.log('первая строка\nвторая\tстрока');

    expect(logSpy).toHaveBeenCalledWith(
      'level=log\tmessage=первая строка вторая строка\n',
    );
  });

  it('пишет ошибку в stderr с уровнем error', () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('Фильм не найден');

    expect(errorSpy).toHaveBeenCalledWith(
      'level=error\tmessage=Фильм не найден\n',
    );
  });
});
