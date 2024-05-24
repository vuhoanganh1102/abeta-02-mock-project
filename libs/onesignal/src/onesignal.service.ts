import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dtos/createNotification.dto';
import { Exception } from '@app/core/exception';
import { ErrorCode } from '@app/core/constants/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { OneSignal } from './onesignal';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';

@Injectable()
export class OnesignalService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(UserNotification)
    private userNotificationRepository: Repository<UserNotification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private oneSignal: OneSignal,
  ) {}
  async create(senderId: number, createDto: CreateNotificationDto) {
    const receiver = await this.adminRepository.findOne({
      where: {
        id: createDto.receiverId,
      },
    });
    if (!receiver) {
      throw new Exception(ErrorCode.User_Not_Found);
    }
    const newNotification = await this.notificationRepository.save({
      title: createDto.title,
      content: createDto.content,
      adminId: createDto.receiverId,
    });
    const newUserNotification = await this.userNotificationRepository.save({
      userId: senderId,
      notificationId: newNotification.id,
      //   read: false,
    });

    const msg = await this.oneSignal.pushNotification(
      [receiver.id],
      newNotification.title,
      newNotification.content,
    );
    if (msg)
      return {
        notification: newNotification,
        userNotification: newUserNotification,
        msg,
      };
  }
}
