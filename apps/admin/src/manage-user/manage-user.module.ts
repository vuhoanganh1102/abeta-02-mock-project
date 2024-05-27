import { Module } from '@nestjs/common';
import { ManageUserService } from './manage-user.service';
import { ManageUserController } from './manage-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { SendgridModule } from '@app/sendgrid/sendgrid.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfig, IConfigSendGrid } from '../config';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import {FirebaseUploadModule} from "@app/firebase-upload";

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
    FirebaseUploadModule,
  ],
  controllers: [ManageUserController],
  providers: [ManageUserService],
})
export class ManageUserModule {}
