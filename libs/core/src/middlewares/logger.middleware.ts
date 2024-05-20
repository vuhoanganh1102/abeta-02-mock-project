import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug(`[${req.method}]: ${req.originalUrl}`);

    (async () => {
      try {
        const str = JSON.stringify(req.body);

        if (str.length < 2000) {
          this.logger.debug(str);
        } else {
          this.logger.debug('Body too large');
        }
      } catch (error) {}
    })();
    next();
  }
}
