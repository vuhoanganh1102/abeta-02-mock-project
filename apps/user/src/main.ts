import { CustomLogger } from '@app/core/logging/logging.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.set('trust proxy', 1);
  app.setGlobalPrefix('api/user');
  app.useLogger(new CustomLogger());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('User - HR Management')
    .setDescription('APIs for User')
    .setVersion('1.0')
    .addTag('User')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, document);

  const logger = new Logger();

  await app.listen(3002, async () => {
    logger.log('Server running on port: 3002');
    logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
