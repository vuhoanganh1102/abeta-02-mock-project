import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { OnesignalModule } from '@app/onesignal';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, UserNotification, Admin, User]),
        OnesignalModule,
    ],
    exports: [NotificationService],
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule {}
