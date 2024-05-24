import { Module } from '@nestjs/common';
import { OnesignalService } from './onesignal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, UserNotification, User, Admin]),
  ],
  providers: [OnesignalService],
  exports: [OnesignalService],
})
export class OnesignalModule {}
