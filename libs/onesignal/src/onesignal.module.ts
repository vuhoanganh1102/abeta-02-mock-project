import { Module } from '@nestjs/common';
import { OnesignalService } from './onesignal.service';
import { OneSignal } from './onesignal';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, UserNotification, User, Admin]),
  ],
  providers: [OnesignalService, OneSignal],
  exports: [OnesignalService, OneSignal],
})
export class OnesignalModule {}
