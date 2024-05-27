import { CustomLogger } from '@app/core/logging/logging.service';
import { Logger } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AdminModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.set('trust proxy', 1);
  app.useLogger(new CustomLogger());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Admin CMS - HR management')
    .setDescription('APIs for Admin')
    .setVersion('1.0')
    .addTag('Admin')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, document);

  const logger = new Logger();

  await app.listen(3001, async () => {
    logger.log(`Server running on port: 3001`);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
