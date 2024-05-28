import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { Repository } from 'typeorm';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { Exception } from '@app/core/exception';
import { ErrorCode, ReadNotification } from '@app/core/constants/enum';
import { assignPaging, returnPaging } from '@app/helpers';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}
  async findAll(
    id: number,
    pageIndex: number,
    pageSize: number,
    isRead: number,
  ) {
    const params = assignPaging({
      pageIndex: pageIndex,
      pageSize: pageSize,
    });
    const queryBuilder = this.userNotificationRepository
      .createQueryBuilder('userNotification')
      .leftJoinAndSelect('userNotification.notification', 'notification')
      .where('userNotification.receiverId = :id', { id })
      .andWhere('userNotification.deletedAt IS NULL');

    if (isRead == 1) {
      queryBuilder.andWhere('userNotification.isRead = :isRead', {
        isRead: ReadNotification.READ,
      });
    } else if (isRead == 0) {
      queryBuilder.andWhere('userNotification.isRead = :isRead', {
        isRead: ReadNotification.UNREAD,
      });
    }

    queryBuilder.skip(params.skip).take(params.pageSize);

    const [notifications, totalNotifications] =
      await queryBuilder.getManyAndCount();

    const pagingResult = returnPaging(
      notifications,
      totalNotifications,
      params,
    );

    return {
      notifications: pagingResult,
    };
  }

  async delete(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    if (!notification) {
      throw new Exception(ErrorCode.Notification_Not_Found);
    }
    return this.notificationRepository.update(
      { id: id },
      { deletedAt: new Date().toISOString() },
    );
  }
  async updateReadStatus(id: number) {
    const notification = await this.userNotificationRepository.findOne({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    if (!notification) {
      throw new Exception(ErrorCode.Notification_Not_Found);
    }
    return this.userNotificationRepository.update(
      { id: id },
      { isRead: ReadNotification.READ },
    );
  }

  async readAllNotification(id: number) {
    const notifications = await this.userNotificationRepository.find({
      where: {
        receiverId: id,
        deletedAt: null,
        isRead: ReadNotification.UNREAD,
      },
    });
    for (const notification of notifications) {
      await this.userNotificationRepository.update(
        { id: notification.id },
        { isRead: ReadNotification.READ },
      );
    }
    return notifications;
  }
}
