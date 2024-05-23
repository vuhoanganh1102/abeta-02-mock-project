import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { SendgridModule } from '@app/sendgrid/sendgrid.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig, IConfigSendGrid } from '../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, EmailOtp]),
    SendgridModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigSendGrid>('sendGrid'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
