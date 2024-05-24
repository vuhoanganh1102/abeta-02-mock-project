import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '@app/database-type-orm/entities/Notification.entity';
import { Repository } from 'typeorm';
import { UserNotification } from '@app/database-type-orm/entities/UserNotification.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { Exception } from '@app/core/exception';
import {ErrorCode, ReadNotification} from '@app/core/constants/enum';
import {assignPaging, returnPaging} from "@app/helpers";

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
    async findAll(id: number, pageIndex: number, pageSize: number) {
        const params = assignPaging({
            pageIndex: pageIndex,
            pageSize: pageSize,
        });
        const notification = await this.userNotificationRepository.find({
            where: {
                receiverId: id,
                deletedAt: null,
            },
            relations: {
                notification: true,
            },
            skip: params.skip,
            take: params.pageSize,
        });
        const totalNotifications = await this.userNotificationRepository.count({
            where: {
                receiverId: id,
                deletedAt: null,
            },
        });
        const pagingResult = returnPaging(notification, totalNotifications, params);
        return {
            notifications: pagingResult,
        };
    }
    async update(id: number, updateData: Partial<User>) {
        const notif = await this.notificationRepository.findOne({
            where: {
                id: id,
                deletedAt: null,
            },
        });
        if (!notif) {
            throw new Exception(ErrorCode.Notification_Not_Found);
        }
        Object.assign(notif, updateData);
        return this.notificationRepository.update(id, updateData);
    }
    async delete(id: number) {
        const notif = await this.notificationRepository.findOne({
            where: {
                id: id,
                deletedAt: null,
            },
        });
        if (!notif) {
            throw new Exception(ErrorCode.Notification_Not_Found);
        }
        return this.notificationRepository.update(
            { id: id },
            { deletedAt: new Date().toISOString() },
        );
    }
    async updateReadStatus(id: number) {
        const notif = await this.userNotificationRepository.findOne({
            where: {
                id: id,
                deletedAt: null,
            },
        });
        if (!notif) {
            throw new Exception(ErrorCode.Notification_Not_Found);
        }
        return this.userNotificationRepository.update({ id: id }, { isRead: ReadNotification.READ });
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
