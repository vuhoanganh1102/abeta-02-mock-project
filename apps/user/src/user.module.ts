import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { IConfig, IConfigAuth, IConfigSendGrid } from './config';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ProfileModule } from './profile/profile.module';
import { JwtAuthenticationModule, UserGuard } from '@app/jwt-authentication';
import { dataSource } from '@app/database-type-orm/data-source';
import { SendgridModule } from '@app/sendgrid';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from '@app/core/filters/http-exception.filter';
import { TransformResponseInterceptor } from '@app/core/interceptors/transform-res.interceptor';
import { EmployeeModule } from './employee/employee.module';
import { NotificationModule } from './notification/notification.module';

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
    AuthModule,
    ProfileModule,
    AttendanceModule,
    EmployeeModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserGuard,
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
export class UserModule {}
