import { User } from '@app/database-type-orm/entities/User.entity';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { SendgridModule } from '@app/sendgrid/sendgrid.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig, IConfigSendGrid } from 'apps/admin/src/config';
import {QueueModule} from "@app/queue";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailOtp]),
    SendgridModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig, true>) => ({
        ...configService.get<IConfigSendGrid>('sendGrid'),
      }),
      inject: [ConfigService],
    }),
      QueueModule
  ],
  exports: [AuthService],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
