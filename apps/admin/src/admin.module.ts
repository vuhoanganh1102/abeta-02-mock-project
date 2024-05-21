import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { IConfig, IConfigAuth, IConfigSendGrid } from './config';
import { JwtAuthenticationModule } from '@app/jwt-authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from '@app/database-type-orm/data-source';
import { SendgridModule } from '@app/sendgrid';
// import { SendMailService } from '@app/send-mail-ha';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
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
        entities: [Admin],
      }),
      dataSourceFactory: async () => {
        return await dataSource.initialize();
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Admin, User]),
    SendgridModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigSendGrid>('sendGrid'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
