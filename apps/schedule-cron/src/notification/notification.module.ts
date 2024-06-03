import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { NotificationService } from './notification.service';
import { OnesignalModule } from '@app/onesignal';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Notification, UserNotification]),
    OnesignalModule,
  ],
  controllers: [],
  providers: [NotificationService],
})
export class NotificationModule {}
