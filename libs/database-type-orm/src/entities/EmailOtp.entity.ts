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
import { IsCurrent } from '../../../core/src/constants/enum';
import { User } from '@app/database-type-orm/entities/User.entity';

@Entity('email_otp')
export class EmailOtp {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'user_email', type: 'varchar' })
  email: string;

  @Column({ name: 'otp', type: 'varchar', length: 500 })
  otp: string;

  @Column({
    name: 'otp_category',
    type: 'tinyint',
    comment: '0: verify otp, 1: reset password otp',
  })
  otpCategory: number;

  @Column({ name: 'user_type', type: 'tinyint', comment: '0: user, 1: admin' })
  userType: number;

  @Column({
    name: 'is_current',
    type: 'tinyint',
    default: IsCurrent.IS_CURRENT,
  })
  isCurrent: number;

  @Column({ name: 'expired_at', type: 'datetime' })
  expiredAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
