import { Injectable, LoggerService } from '@nestjs/common';

/**
 * Логгер для других машин: формат TSKV (Tab-Separated Key-Value).
 * Поля разделены табуляцией, записи — переводом строки.
 */
@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const fields = [
      `level=${this.escape(level)}`,
      `message=${this.escape(message)}`,
    ];

    optionalParams.forEach((param, index) => {
      fields.push(`param${index}=${this.escape(param)}`);
    });

    return `${fields.join('\t')}\n`;
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('fatal', message, ...optionalParams));
  }

  private escape(value: unknown): string {
    return String(value).replace(/[\t\n\r]/g, ' ');
  }
}
