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

    if (isRead === 1) {
      queryBuilder.andWhere('userNotification.isRead = :isRead', {
        isRead: ReadNotification.READ,
      });
    } else if (isRead === 0) {
      queryBuilder.andWhere('userNotification.isRead = :isRead', {
        isRead: ReadNotification.UNREAD,
      });
    }

    queryBuilder.skip(params.skip).take(params.pageSize);

    const [notifications, totalNotifications] =
      await queryBuilder.getManyAndCount();

    return returnPaging(notifications, totalNotifications, params);
  }

  async delete(id: number) {
    const result = await this.notificationRepository.update(
      {
        id: id,
        deletedAt: null,
      },
      { deletedAt: new Date().toISOString() },
    );
    if (result.affected === 0) {
      throw new Exception(ErrorCode.Notification_Not_Found);
    }
    return result;
  }
  async updateReadStatus(id: number) {
    const result = await this.userNotificationRepository.update(
      { id },
      { isRead: ReadNotification.READ },
    );
    if (result.affected === 0) {
      throw new Exception(ErrorCode.Notification_Not_Found);
    }
    return this.userNotificationRepository.findOne({
      where: { id },
      select: ['id', 'receiverId', 'notificationId', 'isRead'],
      relations: ['notification'],
    });
  }

  async readAllNotification(id: number) {
    return this.userNotificationRepository.update(
      { receiverId: id, isRead: ReadNotification.UNREAD },
      { isRead: ReadNotification.READ },
    );
  }
}
