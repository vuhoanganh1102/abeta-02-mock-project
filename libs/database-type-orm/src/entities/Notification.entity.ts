import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Admin } from './Admin.entity';
import { UserNotification } from './UserNotification.entity';
import { NotificationStatus } from '../../../core/src/constants/enum';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'content', type: 'varchar', length: 1000 })
  content: string;

  @Column({
    name: 'status',
    type: 'tinyint',
    default: NotificationStatus.PENDING,
  })
  status: number;

  @ManyToOne(() => Admin, (admin) => admin.notifications)
  @JoinColumn({ name: 'sender_id' })
  sender: Admin;

  @Column({ name: 'sender_id', type: 'bigint', unsigned: true })
  senderId: number;

  @OneToMany(
    () => UserNotification,
    (userNotification) => userNotification.notification,
  )
  userNotifications: UserNotification[];

  @Column({ name: 'schedule_time', type: 'varchar' })
  scheduleTime: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
