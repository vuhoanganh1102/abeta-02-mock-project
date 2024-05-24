
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
import {ErrorCode, NotificationStatus} from '@app/core/constants/enum';
import { Cron } from '@nestjs/schedule';
import {OneSignal} from "@app/onesignal/onesignal";

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
    private readonly onesignalService: OneSignal,
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
    const scheduleTime = this.combineDateTime(createDto.date, createDto.time);
    //create notification
    const notification = await this.notificationRepository.save({
      title: createDto.title,
      content: createDto.content,
      adminId: adminId,
      scheduleTime: scheduleTime,
    });
    //create user notification
    const userNotification = await this.userNotificationRepository.save({
      userId: createDto.userId,
      notificationId: notification.id,
    });
    return {
      receiver: {
        ...existedUser,
      },
      notification: {
        ...notification,
      },
    };
  }

  getListNotification() {
    return this.notificationRepository.find();
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
        .where('notification.status = :status', { status: NotificationStatus.PENDING })
        .andWhere('notification.scheduleTime < :currentDate', { currentDate })
        .getMany();
    //push all if schedule time passed
    for (const notification of pendingNotifications) {
      const receiver = await this.userNotificationRepository.findOneBy({ notificationId: notification.id });
      if (receiver) {
        await this.onesignalService.pushNotification([receiver.id], notification.title, notification.content);
        await this.notificationRepository.update(notification.id, { status: NotificationStatus.SENT });
      }
    }
  }
}

