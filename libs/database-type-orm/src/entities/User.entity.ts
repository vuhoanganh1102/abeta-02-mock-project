import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  // JoinColumn,
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

  @Column({ name: 'password', type: 'varchar', length: 255, select: false })
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

  @Column({ name: 'avatar', type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 500,
    nullable: true,
    select: false,
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
  attendances: Attendance[];

  @OneToMany(
    () => UserNotification,
    (user_notification) => user_notification.user,
  )
  user_notifications: UserNotification[];

  @OneToMany(() => EmailOtp, (otp) => otp.user)
  otp: EmailOtp[];

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
