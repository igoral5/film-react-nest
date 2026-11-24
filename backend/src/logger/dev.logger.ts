import { ConsoleLogger, Injectable } from '@nestjs/common';

/**
 * Логгер для разработки: цветной и читаемый вывод из коробки.
 */
@Injectable()
export class DevLogger extends ConsoleLogger {}
