import { CustomLogger } from '@app/core/logging/logging.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './user.module';
import { IConfig } from '../../mock-project/src/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.set('trust proxy', 1);
  app.useLogger(new CustomLogger());
  const configService: ConfigService<IConfig> = app.get(ConfigService);
  const port = configService.get<number>('port', 3002);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('User Project')
    .setDescription('description of the user project')
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
