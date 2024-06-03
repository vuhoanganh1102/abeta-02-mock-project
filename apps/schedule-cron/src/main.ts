import { NestFactory } from '@nestjs/core';
import { ScheduleCronModule } from './schedule-cron.module';

async function bootstrap() {
  const app = await NestFactory.create(ScheduleCronModule);
  await app.listen(3003);
}
bootstrap();
