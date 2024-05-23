import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Notification } from './Notification.entity';
import {ReadNotification} from "../../../core/src/constants/enum";

@Entity()
export class UserNotification {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => User, (user) => user.user_notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @ManyToOne(
    () => Notification,
    (notification) => notification.userNotifications,
  )
  @JoinColumn({ name: 'notification_id' })
  notification: Notification;

  @Column({ name: 'notification_id', type: 'bigint', unsigned: true })
  notificationId: number;

  @Column({name: 'is_read', type: "tinyint", unsigned: true, default: ReadNotification.UNREAD})
  isRead: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
