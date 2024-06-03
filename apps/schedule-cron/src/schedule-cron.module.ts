import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { dataSource } from '@app/database-type-orm/data-source';
import { OnesignalModule } from '@app/onesignal';
import config, { IConfig } from '../../mock-project/src/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get('typeORMOptions'),
      }),
      dataSourceFactory: async () => {
        return await dataSource.initialize();
      },
      inject: [ConfigService],
    }),
    NotificationModule,
    OnesignalModule,
  ],
})
export class ScheduleCronModule {}
