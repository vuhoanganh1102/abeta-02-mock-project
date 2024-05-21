import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Attendance } from './Attendance.entity';
import { VerifiedStatus } from '../../../core/src/constants/enum';
import { EmailOtp } from './EmailOtp.entity';
import { UserNotification } from './UserNotification.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    name: 'date_of_birth',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  dateOfBirth: string;

  @Column({ name: 'avatar', type: 'varchar', length: 255 })
  avatar: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  refreshToken: string;

  @Column({ name: 'reset_token', type: 'varchar', length: 500, nullable: true })
  resetToken: string;

  @Column({
    name: 'is_verify',
    type: 'tinyint',
    default: VerifiedStatus.NOT_VERIFIED,
  })
  isVerified: number;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  @JoinColumn({ name: 'attendance_id' })
  attendances: Attendance[];

  @Column({ name: 'attendance_id', type: 'bigint', unsigned: true })
  attendanceId: number;

  @OneToMany(
    () => UserNotification,
    (user_notification) => user_notification.user,
  )
  @JoinColumn({ name: 'notification_id' })
  user_notifications: UserNotification[];

  @Column({ name: 'notification_id', type: 'bigint', unsigned: true })
  notificationId: number;

  @OneToMany(() => EmailOtp, (otp) => otp.user)
  @JoinColumn({ name: 'otp_id' })
  otp: EmailOtp[];

  @Column({ name: 'otp_id', type: 'bigint', unsigned: true })
  optId: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
