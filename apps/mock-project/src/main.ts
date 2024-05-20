import { CustomLogger } from '@app/core/logging/logging.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { IConfig } from './config';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.set('trust proxy', 1);
  app.useLogger(new CustomLogger());
  const configService: ConfigService<IConfig> = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Title Project')
    .setDescription('description of the project')
    .setVersion('1.0')
    .addTag('Tags')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, document);

  const logger = new Logger();

  await app.listen(port, async () => {
    logger.log(`Server running on port: ${port}`);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
