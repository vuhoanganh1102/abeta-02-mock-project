import { Logger, ConsoleLogger } from '@nestjs/common';
import { getLogger } from 'log4js';

export class CustomLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    getLogger(context).error(stack, message);
  }
}
