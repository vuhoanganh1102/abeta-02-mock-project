import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { DataSource, Repository } from 'typeorm';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { OnesignalService } from '@app/onesignal';
import { NotificationStatus } from '@app/core/constants/enum';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>,
    private readonly oneSignalService: OnesignalService,
    private readonly dataSource: DataSource,
  ) {}

  @Cron('*/15 * * * *')
  async getListToSend() {
    const currentDate = new Date();
    //find all pending
    const pendingNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.status = :status', {
        status: NotificationStatus.PENDING,
      })
      .andWhere('notification.scheduleTime < :currentDate', { currentDate })
      .getMany();
    //push all if schedule time passed
    for (const notification of pendingNotifications) {
      const receiver = await this.userNotificationRepository.findOneBy({
        notificationId: notification.id,
      });
      if (receiver) {
        await this.oneSignalService.pushNotification(
          [receiver.receiverId],
          notification.title,
          notification.content,
        );
        await this.notificationRepository.update(notification.id, {
          status: NotificationStatus.SENT,
        });
      }
    }
  }
}
