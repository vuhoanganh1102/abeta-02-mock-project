import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { IConfig, IConfigAuth, IConfigSendGrid } from './config';
import { JwtAuthenticationModule } from '@app/jwt-authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from '@app/database-type-orm/data-source';
import { SendgridModule } from '@app/sendgrid';
import {QueueModule} from "@app/queue";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
      cache: true,
      // validate: validateConfig,
    }),
    JwtAuthenticationModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigAuth>('auth'),
      }),
      inject: [ConfigService],
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
    SendgridModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigSendGrid>('sendGrid'),
      }),
      inject: [ConfigService],
    }),
    QueueModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
