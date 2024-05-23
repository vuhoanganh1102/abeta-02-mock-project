import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { IConfig, IConfigAuth, IConfigSendGrid } from './config';
import {
  JwtAuthenticationModule,
  // UserGuard
} from '@app/jwt-authentication';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from '@app/database-type-orm/data-source';
import { SendgridModule } from '@app/sendgrid';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
// import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { AllExceptionsFilter } from '@app/core/filters/http-exception.filter';
// import { TransformResponseInterceptor } from '@app/core/interceptors/transform-res.interceptor';
// import { AdminGuard } from '@app/jwt-authentication/admin.guard';
import { AuthModule } from './auth/auth.module';
import { ManageUserModule } from './manage-user/manage-user.module';
import { AttendanceModule } from './attendance/attendance.module';
import {NotificationModule} from "./notification/notification.module";
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
    AuthModule,
    ManageUserModule,
    AttendanceModule,
    NotificationModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AdminModule {}
