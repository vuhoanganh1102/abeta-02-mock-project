import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { Repository } from 'typeorm';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dtos/createNotification.dto';
import { format, parseISO } from 'date-fns';
import { Exception } from '@app/core/exception';
import { ErrorCode, NotificationStatus } from '@app/core/constants/enum';
import { Cron } from '@nestjs/schedule';
import { OnesignalService } from '@app/onesignal/onesignal.service';
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
    private readonly onesignalService: OnesignalService,
  ) {}

  async createNewNotification(
    adminId: number,
    createDto: CreateNotificationDto,
  ) {
    //check sender exist
    const existedAdmin = this.adminRepository.findOneBy({
      id: adminId,
    });
    if (!existedAdmin) {
      throw new Exception(ErrorCode.Admin_Not_Found);
    }
    //check receiver exist
    const existedUser = await this.userRepository.findOne({
      where: {
        id: createDto.userId,
      },
      select: ['id', 'email', 'firstName', 'lastName', 'dateOfBirth'],
    });
    if (!existedUser) {
      throw new Exception(ErrorCode.User_Not_Found);
    }
    //combine date and time
    const dateTimeString = `${createDto.date}T${createDto.time}`;
    const scheduleTime = new Date(dateTimeString);
    //create notification
    const notification = await this.notificationRepository.save({
      title: createDto.title,
      content: createDto.content,
      senderId: adminId,
      scheduleTime: scheduleTime.toISOString(),
    });
    //create user notification
    const userNotification = await this.userNotificationRepository.save({
      receiverId: createDto.userId,
      notificationId: notification.id,
    });
    if (userNotification)
      return {
        receiver: {
          ...existedUser,
        },
        notification: {
          ...notification,
        },
      };
  }

  async getListNotification(pageIndex: number, pageSize: number) {
    const params = assignPaging({
      pageIndex: pageIndex,
      pageSize: pageSize,
    });
    const queryBuilder = this.userNotificationRepository
      .createQueryBuilder('userNotification')
      .leftJoinAndSelect('userNotification.notification', 'notification')
      .where('userNotification.deletedAt IS NULL')
      .skip(params.skip)
      .take(params.pageSize);

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

  getOneNotification(id: number) {
    return this.notificationRepository.findOneBy({
      id: id,
    });
  }

  async updateNotification(id: number, updateDto: UpdateNotificationDto) {
    //check receiver exist
    const existedUser = await this.userRepository.findOne({
      where: {
        id: updateDto.userId,
      },
      select: ['id', 'email', 'firstName', 'lastName', 'dateOfBirth'],
    });
    if (!existedUser) {
      throw new Exception(ErrorCode.User_Not_Found);
    }
    //combine date and time
    const scheduleTime = this.combineDateTime(updateDto.date, updateDto.time);
    //update
    const notification = await this.notificationRepository.update(id, {
      title: updateDto.title,
      content: updateDto.content,
      scheduleTime: scheduleTime,
    });
    const userNotification = await this.userNotificationRepository.update(
      { notificationId: id },
      {
        receiverId: updateDto.userId,
      },
    );
    if (userNotification)
      return {
        receiver: {
          ...existedUser,
        },
        notification: {
          ...notification,
        },
      };
  }

  async deleteNotification(id: number) {
    await this.notificationRepository.update(id, {
      deletedAt: new Date().toISOString(),
    });
    await this.userNotificationRepository.update(
      { notificationId: id },
      { deletedAt: new Date().toISOString() },
    );
    return {
      message: 'Deleted Successfully',
    };
  }

  combineDateTime(date: string, time: string): string {
    const dateTimeString = `${date}T${time}`;
    const dateTime = parseISO(dateTimeString);
    return format(dateTime, 'yyyy-MM-dd HH:mm:ss.SSSxxx');
  }

  @Cron('*/5 * * * *')
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
        await this.onesignalService.pushNotification(
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
